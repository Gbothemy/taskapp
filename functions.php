<?php
session_start();
require_once 'config.php';

function generateReferralCode($length = 8) {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $code;
}

function get_user_by_username($username)
{
    global $conn;
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_assoc($result);
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function redirectToLogin() {
    header("Location: login.php");
    exit();
}

function getUserPoints($userId) {
    global $conn;
    $stmt = $conn->prepare("SELECT points, withdrawable_points FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

function updateUserPoints($userId, $points, $withdrawable) {
    global $conn;
    $stmt = $conn->prepare("UPDATE users SET points = points + ?, withdrawable_points = withdrawable_points + ? WHERE id = ?");
    $stmt->bind_param("iii", $points, $withdrawable, $userId);
    return $stmt->execute();
}

// Add CSRF protection
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Add input validation function
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Add function to check if user is admin
function isAdmin() {
    return isset($_SESSION['user_id']) && $_SESSION['is_admin'] === true;
}

?>