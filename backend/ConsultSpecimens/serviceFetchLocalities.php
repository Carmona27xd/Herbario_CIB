<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $municipality = $input['idMunicipality'];

    $sql = "SELECT name FROM Locality WHERE idMunicipality = ? ORDER BY name";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$municipality]);
    $localities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($localities);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}