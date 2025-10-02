<?php
require '../database/connectionDB.php'; 
require '../vendor/autoload.php';

use Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$key = "super_secret_key";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->email) || !isset($data->password)) {
        echo json_encode(["error" => "Faltan datos"]);
        exit();
    }

    $email = $data->email;
    $password = $data->password;

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND is_verified = 1 LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Crear el payload del JWT
        $payload = [
            "user_id" => $user['id'],
            "email" => $user['email'],
            "role" => $user['role_id'],
            "exp" => time() + (60 * 60) // 1 hora de validez
        ];

        // Generar JWT
        $jwt = JWT::encode($payload, $key, 'HS256');

        echo json_encode([
            "jwt" => $jwt,
            "role" => $user['role_id'],
            "email" => $user['email'],
            "message" => "Inicio de sesión exitoso"
        ]);
        
    } else {
        echo json_encode(["error" => "Correo o contraseña incorrectos"]);
    }
}
?>
