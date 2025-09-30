<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php'; 
require '../../vendor/autoload.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $sql = "SELECT idSpecimen, ScientificName, PlantClassification, Abundance FROM VistaEjemplarDetalles";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($datos)) {
        echo json_encode($datos);
    } else {
        echo json_encode(["message" => "No se encontraron datos."]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>