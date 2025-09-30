<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $state = $input['idState'];

    $sql = "SELECT idMunicipality, name FROM Municipality WHERE idState = ? ORDER BY name";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$state]);
    $municipalities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($municipalities);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
