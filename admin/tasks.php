<?php
require_once '../functions.php';

// Add admin authentication here

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['add_task'])) {
        $title = $_POST['title'];
        $description = $_POST['description'];
        $points = $_POST['points'];
        
        $stmt = $conn->prepare("INSERT INTO tasks (title, description, points) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $title, $description, $points);
        $stmt->execute();
    } elseif (isset($_POST['delete_task'])) {
        $taskId = $_POST['task_id'];
        
        $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $taskId);
        $stmt->execute();
    }
}

$tasks = $conn->query("SELECT * FROM tasks ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Tasks - TazkAPP Admin</title>
    <style>
        /* Add your styles here, similar to the admin index page */
    </style>
</head>
<body>
    <header>
        <!-- Add your header here, similar to the admin index page -->
    </header>

    <div class="container">
        <h2>Manage Tasks</h2>
        
        <div class="admin-section">
            <h3>Add New Task</h3>
            <form action="tasks.php" method="post">
                <input type="text" name="title" placeholder="Task Title" required>
                <textarea name="description" placeholder="Task Description" required></textarea>
                <input type="number" name="points" placeholder="Points" required>
                <input type="submit" name="add_task" value="Add Task">
            </form>
        </div>

        <div class="admin-section">
            <h3>Existing Tasks</h3>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Points</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                <?php foreach ($tasks as $task): ?>
                    <tr>
                        <td><?php echo $task['title']; ?></td>
                        <td><?php echo $task['description']; ?></td>
                        <td><?php echo $task['points']; ?></td>
                        <td><?php echo $task['status']; ?></td>
                        <td>
                            <a href="edit_task.php?id=<?php echo $task['id']; ?>">Edit</a>
                            <form action="tasks.php" method="post" style="display: inline;">
                                <input type="hidden" name="task_id" value="<?php echo $task['id']; ?>">
                                <input type="submit" name="delete_task" value="Delete" onclick="return confirm('Are you sure you want to delete this task?');">
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>
</body>
</html>