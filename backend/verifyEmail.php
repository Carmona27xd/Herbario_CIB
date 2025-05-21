<?php
include '../database/connectionDB.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE verification_token = :token AND is_verified = 0");
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    if ($stmt->rowCount() === 1) {
        $update = $pdo->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE verification_token = :token");
        $update->bindParam(':token', $token);
        $update->execute();
        header("Location: ../public/verificationComplete.html");
        exit;
    } else {
        echo "Token inválido o ya verificado.";
    }
} else {
    echo "Token no proporcionado.";
}
