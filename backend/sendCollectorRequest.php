<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json'); 

include '../database/connectionDB.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        if (!isset($_FILES['documents']) || $_FILES['documents']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(["success" => false, "message" => "Error: no se cargo un archivo"]);
            exit;
        }

        if (!isset($_POST['name'], $_POST['first_surname'], $_POST['second_surname'], $_POST['email'], 
        $_POST['ascription'])) {
            echo json_encode(["success" => false, "message" => "Error: datos incompletos"]);
        }

        $name = trim($_POST["name"]);
        $first_surname = trim($_POST["first_surname"]);
        $second_surname = trim($_POST["second_surname"]);
        $email = trim($_POST["email"]);
        $ascription = trim($_POST["ascription"]);

        $pdfData = file_get_contents($_FILES["documents"]["tmp_name"]);
        $pdfFilename = $_FILES["documents"]["name"];

        $stmt = $pdo->prepare("INSERT INTO collector_requests (`name`, `first_surname`, `second_surname`, `email`, `adscription`,
        `documents`, `documents_name`) VALUES (:name, :first_surname, :second_surname, :email, :ascription, :documents, :documents_name)");

        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":first_surname", $first_surname);
        $stmt->bindParam(":second_surname", $second_surname);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":ascription", $ascription);
        $stmt->bindParam(":documents", $pdfData, PDO::PARAM_LOB);
        $stmt->bindParam(":documents_name", $pdfFilename);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar la solicitud"]);
        }
        
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message: " => "Error: metodo no permitido"]);
}
?>