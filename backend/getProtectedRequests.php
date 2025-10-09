<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // OJO: para desarrollo, puedes limitar esto en producción.

include '../database/connectionDB.php';

try {
    $stmt = $pdo->prepare("SELECT `id_request`, `id_specimen`, `name`, `email`, `description`, `status` FROM `protected_request` ORDER BY `id_request` DESC");
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $requests
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Error de base de datos: " . $e->getMessage()
    ]);
}
?>