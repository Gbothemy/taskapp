<?php
require_once '../functions.php';

// Add admin authentication here

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['approve'])) {
        $withdrawalId = $_POST['withdrawal_id'];
        $stmt = $conn->prepare("UPDATE withdrawals SET status = 'approved' WHERE id = ?");
        $stmt->bind_param("i", $withdrawalId);
        $stmt->execute();
    } elseif (isset($_POST['reject'])) {
        $withdrawalId = $_POST['withdrawal_id'];
        $stmt = $conn->prepare("UPDATE withdrawals SET status = 'rejected' WHERE id = ?");
        $stmt->bind_param("i", $withdrawalId);
        $stmt->execute();

        // Refund the points to the user
        $stmt = $conn->prepare("SELECT user_id, amount FROM withdrawals WHERE id = ?");
        $stmt->bind_param("i", $withdrawalId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        updateUserPoints($result['user_id'], 0, $result['amount']);
    }
}

$pendingWithdrawals = $conn->query("SELECT w.id, u.username, w.amount, w.created_at 
                                    FROM withdrawals w 
                                    JOIN users u ON w.user_id = u.id 
                                    WHERE w.status = 'pending' 
                                    ORDER BY w.created_at DESC")->fetch_all(MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Withdrawals - TazkAPP Admin</title>
    <style>
        /* Add your styles here */
    </style>
</head>
<body>
    <header>
        <!-- Add your header here -->
    </header>

    <div class="container">
        <h2>Manage Withdrawals</h2>
        
        <table>
            <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Requested At</th>
                <th>Actions</th>
            </tr>
            <?php foreach ($pendingWithdrawals as $withdrawal): ?>
                <tr>
                    <td><?php echo $withdrawal['username']; ?></td>
                    <td><?php echo $withdrawal['amount']; ?></td>
                    <td><?php echo $withdrawal['created_at']; ?></td>
                    <td>
                        <form action="manage_withdrawals.php" method="post" style="display: inline;">
                            <input type="hidden" name="withdrawal_id" value="<?php echo $withdrawal['id']; ?>">
                            <input type="submit" name="approve" value="Approve">
                            <input type="submit" name="reject" value="Reject">
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </table>
    </div>
</body>
</html>