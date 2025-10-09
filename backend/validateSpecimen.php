<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 

include '../database/connectionDB.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['idSpecimen'])) {
        echo json_encode(["success" => false, "message" => "ID del ejemplar no proporcionado."]);
        exit;
    }

    $idSpecimen = $input['idSpecimen'];

    try {
        $stmt = $pdo->prepare("UPDATE Specimen SET is_validated = 1 WHERE idSpecimen = :idSpecimen");
        $stmt->bindParam(':idSpecimen', $idSpecimen, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Ejemplar validado correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al actualizar el ejemplar."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error de base de datos: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método de solicitud no válido."]);
}
?>