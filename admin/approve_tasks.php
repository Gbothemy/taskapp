<?php
require_once '../functions.php';

// Add admin authentication here

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['approve'])) {
        $userTaskId = $_POST['user_task_id'];
        $stmt = $conn->prepare("UPDATE user_tasks SET status = 'approved' WHERE id = ?");
        $stmt->bind_param("i", $userTaskId);
        $stmt->execute();
    } elseif (isset($_POST['reject'])) {
        $userTaskId = $_POST['user_task_id'];
        $stmt = $conn->prepare("UPDATE user_tasks SET status = 'rejected' WHERE id = ?");
        $stmt->bind_param("i", $userTaskId);
        $stmt->execute();

        // Revert task status to 'available'
        $stmt = $conn->prepare("UPDATE tasks SET status = 'available' WHERE id = (SELECT task_id FROM user_tasks WHERE id = ?)");
        $stmt->bind_param("i", $userTaskId);
        $stmt->execute();
    }
}

$pendingTasks = $conn->query("SELECT ut.id, u.username, t.title, t.points, ut.completed_at 
                              FROM user_tasks ut 
                              JOIN users u ON ut.user_id = u.id 
                              JOIN tasks t ON ut.task_id = t.id 
                              WHERE ut.status = 'completed' 
                              ORDER BY ut.completed_at DESC")->fetch_all(MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Approve Tasks - TazkAPP Admin</title>
    <style>
        /* Add your styles here */
    </style>
</head>
<body>
    <header>
        <!-- Add your header here -->
    </header>

    <div class="container">
        <h2>Approve Completed Tasks</h2>
        
        <table>
            <tr>
                <th>User</th>
                <th>Task</th>
                <th>Points</th>
                <th>Completed At</th>
                <th>Actions</th>
            </tr>
            <?php foreach ($pendingTasks as $task): ?>
                <tr>
                    <td><?php echo $task['username']; ?></td>
                    <td><?php echo $task['title']; ?></td>
                    <td><?php echo $task['points']; ?></td>
                    <td><?php echo $task['completed_at']; ?></td>
                    <td>
                        <form action="approve_tasks.php" method="post" style="display: inline;">
                            <input type="hidden" name="user_task_id" value="<?php echo $task['id']; ?>">
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