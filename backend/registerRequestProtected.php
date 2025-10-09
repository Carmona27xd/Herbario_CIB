<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

include '../database/connectionDB.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Aquí el cambio principal: ahora leemos los datos desde $_POST
    if (!isset($_POST["idSpecimen"], $_POST["name"], $_POST["email"], $_POST["description"], $_POST["status"])) {
        echo json_encode(["success" => false, "message" => "Datos incompletos"]);
        exit;
    }

    $idSpecimen = trim($_POST["idSpecimen"]);
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $description = trim($_POST["description"]);
    $status = trim($_POST["status"]);

    try {
        $stmt = $pdo->prepare("INSERT INTO protected_request
            (`id_specimen`, `name`, `email`, `description`, `status`)
            VALUES (:id_specimen, :name, :email, :description, :status)");

        $stmt->bindParam(":id_specimen", $idSpecimen);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":status", $status);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Exito"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al ejecutar la consulta"]);
        }

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error de base de datos: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método de solicitud no permitido"]);
}