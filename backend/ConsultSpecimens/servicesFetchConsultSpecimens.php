<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try {
    $sql = "SELECT * FROM vista_ejemplares";
    $stmt = $pdo->prepare($sql); 
    $stmt->execute();

    $ejemplares = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($ejemplares);

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>