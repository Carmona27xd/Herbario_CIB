<?php 
require 'vendor/autoload.php';  
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

include '../database/connectionDB.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "metodo no permidito"]);
    exit;
}

$inputData = json_decode(file_get_contents("php://input"), true);
$email = $inputData["email"] ?? "";
$password = $inputData["password"] ?? "";
$roleId = $inputData["role_id"] ?? "";

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Completa todos los campos"]);
    exit;
}

$stmt = $conexion->prepare("SELECT id, name, first_surname, second_surname, email, role_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
    exit;
}

//Generar token JWT
$secretKey = "super_secret_key";
$payload = [
    "user_id" => $user["id"],
    "name" => $user["name"],
    "first_surname" => $user["first_surname"],
    "second_surname" => $user["second_surname"],
    "email" => $user["email"],
    "role_id" => $user["role_id"],
    "exp" => time() + 3600 // 1 hora de expiracion
];

$token = JWT::encode($payload, $secretKey, 'HS256');

echo json_encode(["success" => true, "message" => "Inicio de sesion exitoso", "token" => $token]);
$stmt->close();
$conexion->close();
?>