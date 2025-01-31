<?php
require_once 'functions.php';

if (!isLoggedIn()) {
    redirectToLogin();
}

$userId = $_SESSION['user_id'];
$userPoints = getUserPoints($userId);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (validateCSRFToken($_POST['csrf_token'])) {
        $amount = intval($_POST['amount']);

        if ($amount > 0 && $amount <= $userPoints['withdrawable_points']) {
            // Start a transaction
            $conn->begin_transaction();

            try {
                // Update user points
                $stmt = $conn->prepare("UPDATE users SET withdrawable_points = withdrawable_points - ? WHERE id = ?");
                if ($stmt === false) {
                    throw new Exception("Failed to prepare the update statement: " . $conn->error);
                }
                $stmt->bind_param("ii", $amount, $userId);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to execute the update statement: " . $stmt->error);
                }

                // Insert withdrawal request
                $stmt = $conn->prepare("INSERT INTO withdrawals (user_id, amount, status) VALUES (?, ?, 'pending')");
                if ($stmt === false) {
                    throw new Exception("Failed to prepare the insert statement: " . $conn->error);
                }
                $stmt->bind_param("ii", $userId, $amount);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to execute the insert statement: " . $stmt->error);
                }

                // Commit the transaction
                $conn->commit();
                $message = "Withdrawal request submitted successfully.";

                // Refresh user points
                $userPoints = getUserPoints($userId);
            } catch (Exception $e) {
                // An error occurred, rollback the transaction
                $conn->rollback();
                $error = "Error processing withdrawal: " . $e->getMessage();
            }
        } else {
            $error = "Invalid withdrawal amount.";
        }
    } else {
        $error = "Invalid CSRF token";
    }
}

// Fetch pending withdrawals
$stmt = $conn->prepare("SELECT * FROM withdrawals WHERE user_id = ? AND status = 'pending' ORDER BY created_at DESC");
if ($stmt === false) {
    $error = "Failed to prepare the select statement: " . $conn->error;
} else {
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $pendingWithdrawals = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Withdraw - TazkAPP</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }

            .container {
                width: 80%;
                margin: auto;
                overflow: hidden;
                padding: 20px;
            }

            h2 {
                text-align: center;
            }

            form {
                background: #fff;
                padding: 20px;
                border-radius: 5px;
            }

            input[type="number"] {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
            }

            input[type="submit"] {
                display: block;
                width: 100%;
                padding: 10px;
                background-color: #333;
                color: #fff;
                border: none;
            }

            .error {
                color: red;
                margin-bottom: 10px;
            }

            .message {
                color: green;
                margin-bottom: 10px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }

            th,
            td {
                padding: 10px;
                border: 1px solid #ddd;
                text-align: left;
            }

            th {
                background-color: #333;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Withdraw Points</h2>
            <?php
            if (isset($error))
                echo "<p class='error'>$error</p>";
            if (isset($message))
                echo "<p class='message'>$message</p>";
            ?>
            <p>Available Points: <?php echo $userPoints['points']; ?></p>
            <p>Withdrawable Points: <?php echo $userPoints['withdrawable_points']; ?></p>
            <form action="withdraw.php" method="post">
                <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                <input type="number" name="amount" placeholder="Amount to withdraw" required>
                <input type="submit" value="Submit Withdrawal Request">
            </form>

            <h3>Pending Withdrawals</h3>
            <?php if (isset($pendingWithdrawals) && !empty($pendingWithdrawals)): ?>
                <table>
                    <tr>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Requested At</th>
                    </tr>
                    <?php foreach ($pendingWithdrawals as $withdrawal): ?>
                        <tr>
                            <td><?php echo $withdrawal['amount']; ?></td>
                            <td><?php echo $withdrawal['status']; ?></td>
                            <td><?php echo $withdrawal['created_at']; ?></td>
                        </tr>
                    <?php endforeach; ?>
                </table>
            <?php else: ?>
                <p>No pending withdrawals.</p>
            <?php endif; ?>

            <p><a href="dashboard.php">Back to Dashboard</a></p>
        </div>
    </body>
</html>