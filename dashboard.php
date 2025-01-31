<?php
require_once 'functions.php';

if (!isLoggedIn()) {
    redirectToLogin();
}

$userId = $_SESSION['user_id'];
$userPoints = getUserPoints($userId);

// Fetch available tasks
$stmt = $conn->prepare("SELECT * FROM tasks WHERE status = 'available' AND id NOT IN (SELECT task_id FROM user_tasks WHERE user_id = ?)");
$stmt->bind_param("i", $userId);
$stmt->execute();
$availableTasks = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Fetch ongoing tasks
$stmt = $conn->prepare("SELECT t.* FROM tasks t JOIN user_tasks ut ON t.id = ut.task_id WHERE ut.user_id = ? AND ut.status = 'ongoing'");
$stmt->bind_param("i", $userId);
$stmt->execute();
$ongoingTasks = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Fetch completed tasks
$stmt = $conn->prepare("SELECT t.* FROM tasks t JOIN user_tasks ut ON t.id = ut.task_id WHERE ut.user_id = ? AND ut.status = 'completed'");
$stmt->bind_param("i", $userId);
$stmt->execute();
$completedTasks = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - TazkAPP</title>
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
        header {
            background: #333;
            color: #fff;
            padding-top: 30px;
            min-height: 70px;
            border-bottom: #bbb 1px solid;
        }
        header a {
            color: #fff;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 16px;
        }
        header ul {
            padding: 0;
            margin: 0;
            list-style: none;
            overflow: hidden;
        }
        header li {
            float: left;
            display: inline;
            padding: 0 20px 0 20px;
        }
        header #branding {
            float: left;
        }
        header #branding h1 {
            margin: 0;
        }
        header nav {
            float: right;
            margin-top: 10px;
        }
        .task-section {
            background: #fff;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        .task {
            background: #f4f4f4;
            padding: 10px;
            margin-bottom: 5px;
            border-radius: 3px;
        }
        .points {
            font-weight: bold;
            color: #28a745;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div id="branding">
                <h1>TazkAPP Dashboard</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <li><a href="withdraw.php">Withdraw</a></li>
                    <li><a href="logout.php">Logout</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="container">
        <h2>Welcome to your dashboard</h2>
        <p>Total Points: <span class="points"><?php echo $userPoints['points']; ?></span></p>
        <p>Withdrawable Points: <span class="points"><?php echo $userPoints['withdrawable_points']; ?></span></p>

        <div class="task-section">
            <h3>Available Tasks</h3>
            <input type="text" id="task-search" placeholder="Search tasks...">
            <?php foreach ($availableTasks as $task): ?>
                <div class="task">
                    <h4><?php echo $task['title']; ?></h4>
                    <p><?php echo $task['description']; ?></p>
                    <p>Points: <span class="points"><?php echo $task['points']; ?></span></p>
                    <form action="start_task.php" method="post">
                        <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                        <input type="hidden" name="task_id" value="<?php echo $task['id']; ?>">
                        <input type="submit" value="Start Task">
                    </form>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="task-section">
            <h3>Ongoing Tasks</h3>
            <?php foreach ($ongoingTasks as $task): ?>
                <div class="task">
                    <h4><?php echo $task['title']; ?></h4>
                    <p><?php echo $task['description']; ?></p>
                    <p>Points: <span class="points"><?php echo $task['points']; ?></span></p>
                    <form action="complete_task.php" method="post" class="complete-task-form">
                        <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                        <input type="hidden" name="task_id" value="<?php echo $task['id']; ?>">
                        <input type="submit" value="Complete Task">
                    </form>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="task-section">
            <h3>Completed Tasks</h3>
            <?php foreach ($completedTasks as $task): ?>
                <div class="task">
                    <h4><?php echo $task['title']; ?></h4>
                    <p><?php echo $task['description']; ?></p>
                    <p>Points Earned: <span class="points"><?php echo $task['points']; ?></span></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>