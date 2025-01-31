<?php
require_once 'functions.php';

if (!isLoggedIn()) {
    redirectToLogin();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['task_id'])) {
    $userId = $_SESSION['user_id'];
    $taskId = $_POST['task_id'];

    $stmt = $conn->prepare("INSERT INTO user_tasks (user_id, task_id, status) VALUES (?, ?, 'ongoing')");
    $stmt->bind_param("ii", $userId, $taskId);

    if ($stmt->execute()) {
        $stmt = $conn->prepare("UPDATE tasks SET status = 'ongoing' WHERE id = ?");
        $stmt->bind_param("i", $taskId);
        $stmt->execute();
        header("Location: dashboard.php");
        exit();
    } else {
        $error = "Error starting task. Please try again.";
    }
}

header("Location: dashboard.php");
exit();

