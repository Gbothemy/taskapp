<?php
require_once 'functions.php';

if (!isLoggedIn()) {
    redirectToLogin();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['task_id'])) {
    $userId = $_SESSION['user_id'];
    $taskId = $_POST['task_id'];

    // First, check if the task is actually ongoing for this user
    $stmt = $conn->prepare("SELECT * FROM user_tasks WHERE user_id = ? AND task_id = ? AND status = 'ongoing'");
    $stmt->bind_param("ii", $userId, $taskId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Update user_tasks table
        $stmt = $conn->prepare("UPDATE user_tasks SET status = 'completed', completed_at = NOW() WHERE user_id = ? AND task_id = ?");
        $stmt->bind_param("ii", $userId, $taskId);
        $stmt->execute();

        // Update tasks table
        $stmt = $conn->prepare("UPDATE tasks SET status = 'completed' WHERE id = ?");
        $stmt->bind_param("i", $taskId);
        $stmt->execute();

        // Get task points
        $stmt = $conn->prepare("SELECT points FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $taskId);
        $stmt->execute();
        $taskPoints = $stmt->get_result()->fetch_assoc()['points'];

        // Update user points
        updateUserPoints($userId, $taskPoints, $taskPoints);

        $_SESSION['message'] = "Task completed successfully! You earned $taskPoints points.";
    } else {
        $_SESSION['error'] = "Error completing task. Please try again.";
    }
}

header("Location: dashboard.php");
exit();