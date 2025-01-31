<?php
require_once 'functions.php';

if (!isLoggedIn()) {
    redirectToLogin();
}

$userId = $_SESSION['user_id'];
$userPoints = getUserPoints($userId);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['amount'])) {
    $amount = intval($_POST['amount']);
    $minWithdrawal = 1000; // Minimum withdrawal amount

    if ($amount < $minWithdrawal) {
        $error = "Minimum withdrawal amount is $minWithdrawal points.";
    } elseif ($amount > $userPoints['withdrawable_points']) {
        $error = "Insufficient withdrawable points.";
    } else {
        // Process withdrawal
        $stmt = $conn->prepare("INSERT INTO withdrawals (user_id, amount, status) VALUES (?, ?, 'pending')");
        $stmt->bind_param("ii", $userId, $amount);
        
        if ($stmt->execute()) {
            // Deduct points from user's account
            $stmt = $conn->prepare("UPDATE users SET withdrawable_points = withdrawable_points - ? WHERE id = ?");
            $stmt->bind_param("ii", $amount, $userId);
            $stmt->execute();

            $success = "Withdrawal request for $amount points has been submitted and is pending approval.";
        } else {
            $error = "Error processing withdrawal. Please try again.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdraw Points - TazkAPP</title>
    <style>
        /* Add your styles here */
    </style>
</head>
<body>
    <div class="container">
        <h2>Withdraw Points</h2>
        <p>Available for withdrawal: <?php echo $userPoints['withdrawable_points']; ?> points</p>

        <?php if (isset($error)): ?>
            <p class="error"><?php echo $error; ?></p>
        <?php endif; ?>

        <?php if (isset($success)): ?>
            <p class="success"><?php echo $success; ?></p>
        <?php endif; ?>

        <form action="withdraw.php" method="post">
            <label for="amount">Amount to withdraw:</label>
            <input type="number" id="amount" name="amount" min="1000" max="<?php echo $userPoints['withdrawable_points']; ?>" required>
            <input type="submit" value="Request Withdrawal">
        </form>
    </div>
</body>
</html>