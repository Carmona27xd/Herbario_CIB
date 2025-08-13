<?php
header('Content-Type: application/json');
require_once '../conexion.php'; // tu conexión a la BD

$data = json_decode(file_get_contents("php://input"), true);
$id_specimen = $data['id_specimen'] ?? null;

if (!$id_specimen) {
    echo json_encode(['success' => false, 'message' => 'ID no recibido']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE Specimen SET state = 'Eliminado' WHERE id_specimen = ?");
    $stmt->execute([$id_specimen]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontró el ejemplar o ya estaba eliminado']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en BD: ' . $e->getMessage()]);
}