<?php
require_once '../functions.php';

// Add admin authentication here

$users = $conn->query("SELECT * FROM users ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Users - TazkAPP Admin</title>
    <style>
        /* Add your styles here, similar to the admin index page */
    </style>
</head>
<body>
    <header>
        <!-- Add your header here, similar to the admin index page -->
    </header>

    <div class="container">
        <h2>Manage Users</h2>
        
        <div class="admin-section">
            <h3>User List</h3>
            <table>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Points</th>
                    <th>Withdrawable Points</th>
                    <th>Referral Code</th>
                    <th>Actions</th>
                </tr>
                <?php foreach ($users as $user): ?>
                    <tr>
                        <td><?php echo $user['username']; ?></td>
                        <td><?php echo $user['email']; ?></td>
                        <td><?php echo $user['points']; ?></td>
                        <td><?php echo $user['withdrawable_points']; ?></td>
                        <td><?php echo $user['referral_code']; ?></td>
                        <td>
                            <a href="edit_user.php?id=<?php echo $user['id']; ?>">Edit</a>
                            <a href="delete_user.php?id=<?php echo $user['id']; ?>" onclick="return confirm('Are you sure you want to delete this user?');">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>
</body>
</html>