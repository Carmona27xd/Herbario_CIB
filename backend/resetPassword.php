<?php
include '../database/connectionDB.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';
$newPassword = $data['password'] ?? '';

if (!$token || !$newPassword) {
    echo json_encode(["success" => false, "message" => "Error: Datos incompletos"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE reset_token = :token AND reset_token_expire > NOW()");
$stmt->bindParam(':token', $token);
$stmt->execute();

if ($stmt->rowCount() === 1) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $hashed = password_hash($newPassword, PASSWORD_BCRYPT);

    $update = $pdo->prepare("UPDATE users SET password = :pass, reset_token = NULL, reset_token_expire = NULL WHERE id = :id");
    $update -> execute([':pass' => $hashed, ':id' => $user['id']]);

    echo json_encode(["success" => true, "message" => "success"]);

} else {
    echo json_encode(["success" => false, "message" => "error"]);
}
?>