<?php
header("Content-Type: application/json"); // Establece que la respuesta será JSON
header("Access-Control-Allow-Origin: *"); // Permite peticiones

// 1. INCLUIR TU CONEXIÓN A LA BD
include '../database/connectionDB.php';

// 2. VERIFICAR QUE LA CONEXIÓN (variable $pdo) EXISTE
// (Cambia $pdo por el nombre de tu variable de conexión si es diferente)
if (!isset($pdo)) {
    echo json_encode(['success' => false, 'message' => 'Error: No se pudo establecer la conexión a la BD. Revisa connectionDB.php']);
    exit;
}

// 3. VALIDAR EL ROLE_ID ENVIADO
if (!isset($_GET['role_id']) || !is_numeric($_GET['role_id'])) {
    echo json_encode(['success' => false, 'message' => 'Error: role_id no proporcionado o inválido.']);
    exit;
}

$role_id = (int)$_GET['role_id'];

// 4. EJECUTAR LA CONSULTA
try {
    // Prepara la consulta
    $sql = "SELECT id, name, first_surname, second_surname, email 
            FROM users 
            WHERE role_id = :role_id 
            ORDER BY name ASC";

    // (Usa tu variable de conexión aquí)
    $stmt = $pdo->prepare($sql);
    
    // Asigna el valor al parámetro
    $stmt->bindParam(':role_id', $role_id, PDO::PARAM_INT);
    
    // Ejecuta
    $stmt->execute();

    // Obtiene los resultados
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve la respuesta exitosa
    echo json_encode(['success' => true, 'users' => $users]);

} catch (PDOException $e) {
    // Manejo de errores de la consulta
    echo json_encode(['success' => false, 'message' => 'Error de consulta: ' . $e->getMessage()]);
}
?>