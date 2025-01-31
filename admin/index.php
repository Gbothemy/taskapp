<?php
require_once '../functions.php';

// Add admin authentication here

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Portal - TazkAPP</title>
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

            .admin-section {
                background: #fff;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <div id="branding">
                    <h1>TazkAPP Admin Portal</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="index.php">Dashboard</a></li>
                        <li><a href="tasks.php">Manage Tasks</a></li>
                        <li><a href="users.php">Manage Users</a></li>
                        <li><a href="manage_withdrawals.php">Manage Withdraws</a></li>
                        <li><a href="../logout.php">Logout</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <div class="container">
            <h2>Welcome to the Admin Portal</h2>

            <div class="admin-section">
                <h3>Quick Stats</h3>
                <p>Total Users: <?php echo getTotalUsers(); ?></p>
                <p>Total Tasks: <?php echo getTotalTasks(); ?></p>
                <p>Completed Tasks: <?php echo getCompletedTasks(); ?></p>
            </div>

            <div class="admin-section">
                <h3>Recent Activity</h3>
                <!-- Add recent activity log here -->
            </div>
        </div>
    </body>
</html>