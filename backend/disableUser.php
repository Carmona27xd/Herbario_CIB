<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permite métodos POST
header("Access-Control-Allow-Headers: Content-Type");

// 1. Incluir tu conexión
include '../database/connectionDB.php';

// (Cambia $pdo por el nombre de tu variable de conexión si es diferente)
if (!isset($pdo)) {
    echo json_encode(['success' => false, 'message' => 'Error: No se pudo establecer la conexión a la BD.']);
    exit;
}

// 2. Lee los datos enviados por POST (en formato JSON)
$data = json_decode(file_get_contents('php://input'));

if (!isset($data->user_id) || !is_numeric($data->user_id)) {
    echo json_encode(['success' => false, 'message' => 'Error: ID de usuario no proporcionado o inválido.']);
    exit;
}

$user_id = $data->user_id;

// 3. Prepara y ejecuta el UPDATE
try {
    $sql = "UPDATE users SET is_baned = 1 WHERE id = :user_id";
    
    // (Usa tu variable de conexión aquí)
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    
    $stmt->execute();

    // 4. Verifica si la fila fue realmente actualizada
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Usuario deshabilitado correctamente.']);
    } else {
        // Esto puede pasar si el usuario ya estaba deshabilitado o el ID no existía
        echo json_encode(['success' => false, 'message' => 'No se pudo deshabilitar al usuario (quizás ya lo estaba o el ID no existe).']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de consulta: ' . $e->getMessage()]);
}
?>