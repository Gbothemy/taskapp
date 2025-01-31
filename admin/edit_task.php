<?php
require_once '../functions.php';


if (isset($_GET['id'])) {
    $taskId = intval($_GET['id']);
    $stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ?");
    $stmt->bind_param("i", $taskId);
    $stmt->execute();
    $task = $stmt->get_result()->fetch_assoc();

    if (!$task) {
        header("Location: tasks.php");
        exit();
    }
} else {
    header("Location: tasks.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (validateCSRFToken($_POST['csrf_token'])) {
        $title = sanitizeInput($_POST['title']);
        $description = sanitizeInput($_POST['description']);
        $points = intval($_POST['points']);

        $stmt = $conn->prepare("UPDATE tasks SET title = ?, description = ?, points = ? WHERE id = ?");
        $stmt->bind_param("ssii", $title, $description, $points, $taskId);

        if ($stmt->execute()) {
            $message = "Task updated successfully.";
            $task['title'] = $title;
            $task['description'] = $description;
            $task['points'] = $points;
        } else {
            $error = "Error updating task. Please try again.";
        }
    } else {
        $error = "Invalid CSRF token";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Edit Task - TazkAPP Admin</title>
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

            input[type="text"],
            input[type="number"],
            textarea {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }

            input[type="submit"] {
                display: block;
                width: 100%;
                padding: 10px;
                background-color: #333;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            input[type="submit"]:hover {
                background-color: #555;
            }

            .error {
                color: red;
                margin-bottom: 10px;
            }

            .message {
                color: green;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Edit Task</h2>
            <?php
            if (isset($error))
                echo "<p class='error'>$error</p>";
            if (isset($message))
                echo "<p class='message'>$message</p>";
            ?>
            <form action="edit_task.php?id=<?php echo $taskId; ?>" method="post">
                <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                <input type="text" name="title" placeholder="Task Title" value="<?php echo $task['title']; ?>" required>
                <textarea name="description" placeholder="Task Description"
                    required><?php echo $task['description']; ?></textarea>
                <input type="number" name="points" placeholder="Points" value="<?php echo $task['points']; ?>" required>
                <input type="submit" value="Update Task">
            </form>
            <p><a href="tasks.php">Back to Manage Tasks</a></p>
        </div>
    </body>
</html>