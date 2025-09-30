<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try { 
    $sql = "SELECT idState, name FROM State ORDER BY name";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $states = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($states);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}