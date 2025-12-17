<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

include '../database/connectionDB.php'; // Asegúrate de que esto cree $pdo

// 1. Leer el ID enviado por POST (en formato JSON)
$data = json_decode(file_get_contents('php://input'));

if (!isset($data->id_request) || !is_numeric($data->id_request)) {
    echo json_encode(['success' => false, 'message' => 'ID de solicitud no válido o no proporcionado.']);
    exit;
}

$id_request = $data->id_request;
$new_status = "Rechazada"; // El nuevo estado

try {
    // 2. Preparar la consulta UPDATE
    $stmt = $pdo->prepare(
        "UPDATE new_protected_request 
         SET status = :status 
         WHERE id_request = :id_request"
    );
    
    // 3. Asignar valores
    $stmt->bindParam(':status', $new_status, PDO::PARAM_STR);
    $stmt->bindParam(':id_request', $id_request, PDO::PARAM_INT);
    
    // 4. Ejecutar
    $stmt->execute();

    // 5. Verificar si la actualización fue exitosa
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Solicitud marcada como atendida.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se actualizó ninguna fila (quizás ya estaba atendida o el ID no existe).']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>