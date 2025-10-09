<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

require '../database/connectionDB.php'; // usa tu conexión PDO ($pdo)

try {
    $query = "SELECT * FROM ProtectedSpecimens";
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $specimens = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $specimens
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener ejemplares: " . $e->getMessage()
    ]);
}
?>
