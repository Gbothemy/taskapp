<?php
require_once 'functions.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $referral_code = generateReferralCode();
    $referrer_code = $_POST['referrer_code'] ?? null;

    $stmt = $conn->prepare("INSERT INTO users (username, email, password, referral_code) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $password, $referral_code);

    if ($stmt->execute()) {
        $newUserId = $stmt->insert_id;

        // Process referral
        if ($referrer_code) {
            $stmt = $conn->prepare("SELECT id FROM users WHERE referral_code = ?");
            $stmt->bind_param("s", $referrer_code);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($referrer = $result->fetch_assoc()) {
                $referrerId = $referrer['id'];
                $referralPoints = 100; // Points for successful referral

                // Add referral record
                $stmt = $conn->prepare("INSERT INTO referrals (referrer_id, referred_id, points_earned) VALUES (?, ?, ?)");
                $stmt->bind_param("iii", $referrerId, $newUserId, $referralPoints);
                $stmt->execute();

                // Update referrer's points
                updateUserPoints($referrerId, $referralPoints, $referralPoints);
            }
        }

        $_SESSION['user_id'] = $newUserId;
        header("Location: dashboard.php");
        exit();
    } else {
        $error = "Error creating account. Please try again.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - TazkAPP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 300px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
        }
        input[type="text"],
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        input[type="submit"] {
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
    </style>
</head>
<body>
    <div class="container">
        <h2>Sign Up</h2>
        <?php if (isset($error)) echo "<p class='error'>$error</p>"; ?>
        <form action="signup.php" method="post">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="text" name="referrer_code" placeholder="Referral Code (optional)">
            <input type="submit" value="Sign Up">
        </form>
        <p>Already have an account? <a href="login.php">Login here</a></p>
    </div>
</body>
</html>