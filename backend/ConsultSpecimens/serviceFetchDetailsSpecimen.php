<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try {
    if (!isset($_GET['idSpecimen'])) {
        throw new Exception("Falta el parámetro idSpecimen.");
    }

    $idSpecimen = $_GET['idSpecimen'];

    $sql = "SELECT * FROM viewDetailsSpecimensPopup WHERE idSpecimen = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idSpecimen]);

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($data ?: ['error' => 'Ejemplar no encontrado']);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>