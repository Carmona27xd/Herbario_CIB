<?php
include '../database/connectionDB.php';
require 'sendResetPasswordEmail.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])) {
    echo json_encode(["success" => false, "message" => "No se proporciono el correo"]);
    exit;
}

$email = $data['email'];

$stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = :email AND is_verified = 1");
$stmt->bindParam(':email', $email);
$stmt->execute();

if ($stmt->rowCount() === 1) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $reset_token = bin2hex(random_bytes(16));
    $expire = date("Y-m-d H:i:s", time() + 3600);

    $update = $pdo->prepare("UPDATE users SET reset_token = :token, reset_token_expire = :expire WHERE id = :id");
    $update->execute([
        ':token' => $reset_token,
        ':expire' => $expire,
        ':id' => $user['id']
    ]);

    $reset_link = "http://localhost/herbario/public/resetPassword.html?token=$reset_token";

    sendResetPasswordEmail($email, $reset_link);

    echo json_encode(["success" => true, "message" => "success"]);

} else {
    echo json_encode(["success" => false, "message" => "email not registered"]);
}

?>