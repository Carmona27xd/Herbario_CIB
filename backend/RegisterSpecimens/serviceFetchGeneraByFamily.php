<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// 1. Incluir conexión (Subimos un nivel con ../)
include_once('../../database/connectionDB.php');

// Verificación rápida de que $pdo existe
if (!isset($pdo)) {
    echo json_encode(["error" => "No se encontró la conexión PDO"]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$response = [];

if (isset($data['idFamily'])) {
    $idFamily = $data['idFamily'];

    try {
        // 2. Consulta estilo PDO
        $sql = "SELECT idGenus, name FROM genus WHERE idFamily = :idFamily ORDER BY name ASC";
        $stmt = $pdo->prepare($sql);
        
        // Vincular parámetro (bindValue es más seguro aquí)
        $stmt->bindValue(':idFamily', $idFamily, PDO::PARAM_INT);
        $stmt->execute();

        // 3. Obtener resultados
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {
        echo json_encode(["error" => "Error SQL: " . $e->getMessage()]);
        exit;
    }
}

echo json_encode($response);
?>