<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
include '../database/connectionDB.php'; 

try {
    $stmt = $pdo->prepare("SELECT id_request, name, first_surname, second_surname, email FROM collector_requests");
    $stmt->execute();

    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($requests);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>