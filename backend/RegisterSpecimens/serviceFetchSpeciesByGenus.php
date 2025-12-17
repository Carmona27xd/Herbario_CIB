<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include_once('../../database/connectionDB.php');

if (!isset($pdo)) {
    echo json_encode(["error" => "No se encontró la conexión PDO"]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$response = [];

if (isset($data['idGenus'])) {
    $idGenus = $data['idGenus'];

    try {
        // Consulta estilo PDO
        $sql = "SELECT idSpecies, name FROM species WHERE idGenus = :idGenus ORDER BY name ASC";
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindValue(':idGenus', $idGenus, PDO::PARAM_INT);
        $stmt->execute();

        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {
        echo json_encode(["error" => "Error SQL: " . $e->getMessage()]);
        exit;
    }
}

echo json_encode($response);
?>