<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
include '../database/connectionDB.php'; 

try {
    $stmt = $pdo->prepare("SELECT id_collector, names, first_surname, second_surname, ascription, email FROM collector");
    $stmt->execute();

    $collectors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($collectors);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>