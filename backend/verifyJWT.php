<?php
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$key = "super_secret_key";

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->jwt)) {
    echo json_encode(["valid" => false]);
    exit();
}

try {
    $decoded = JWT::decode($data->jwt, new Key($key, 'HS256'));
    echo json_encode([
        "valid" => true,
        "email" => $decoded->email,
        "role" => $decoded->role
    ]);
} catch (Exception $e) {
    echo json_encode(["valid" => false]);
}
?>
