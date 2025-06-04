<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
include '../database/connectionDB.php'; 

try {
    $stmt = $pdo->prepare("SELECT id_request, name, first_surname, second_surname, email, ref_name, ref_first_surname, ref_second_surname, 
    ref_email, curriculum_name, permit_name, letter_name, proyect_name FROM collector_requests");
    $stmt->execute();

    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($requests);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>