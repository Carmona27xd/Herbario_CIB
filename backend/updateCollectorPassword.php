<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../vendor/autoload.php';

$conexion_path = '../database/connectionDB.php';
if (file_exists($conexion_path)) {
    include $conexion_path;
} else {
    die(json_encode(['success' => false, 'message' => 'Error: No se encontró connectionDB.php']));
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    if (empty($_POST['email']) || empty($_POST['new_password'])) {
        throw new Exception("Faltan datos obligatorios", 400);
    }

    $email = trim($_POST['email']);
    $newPassword = password_hash(trim($_POST['new_password']), PASSWORD_BCRYPT);

    $sql = "UPDATE users SET password = :password WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':password' => $newPassword,
        ':email' => $email
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Contraseña actualizada correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "No se encontró el usuario o no se cambió la contraseña."]);
    }

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
