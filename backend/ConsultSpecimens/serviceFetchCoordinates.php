<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try {
    // Leer los IDs de los ejemplares desde el frontend (POST en formato JSON)
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['specimenIds']) || !is_array($input['specimenIds'])) {
        throw new Exception("No se recibieron los ejemplares correctamente.");
    }

    // Construir placeholders (?, ?, ?, ...) para la consulta
    $placeholders = implode(',', array_fill(0, count($input['specimenIds']), '?'));

    $sql = "SELECT * FROM vista_coordenadas_ejemplares WHERE idSpecimen IN ($placeholders)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($input['specimenIds']);

    $coordenadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($coordenadas);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>