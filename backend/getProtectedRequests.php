<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);
require_once '../database/connectionDB.php';

try {
    // 1. Obtener el estado del filtro (Default: 'Pendiente')
    $status = isset($_GET['status']) ? $_GET['status'] : 'Pendiente';

    // 2. Consulta a la nueva tabla
    // Nota: Seleccionamos 'id_specimens' (plural) porque así se definió en tu tabla
    $sql = "SELECT id_request, date, first_names, name, email, status, id_specimens 
            FROM new_protected_request 
            WHERE status = :status 
            ORDER BY date DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':status', $status);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error en BD: " . $e->getMessage()
    ]);
}
?>