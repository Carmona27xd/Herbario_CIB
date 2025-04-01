<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json'); 

include '../database/connectionDB.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Verificar que el archivo PDF fue cargado
        if (!isset($_FILES['pdfFile']) || $_FILES['pdfFile']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['success' => false, 'message' => "Error, no se cargó un archivo PDF"]);
            exit;
        } 

        // Verificar que todos los datos estén presentes
        if (!isset($_POST['name'], $_POST['first_surname'], $_POST['second_surname'], $_POST['ascription'])) {
            echo json_encode(["success" => false, "message" => "Error: datos incompletos"]);
            exit;
        }

        // Obtener los valores del formulario
        $name = trim($_POST["name"]);
        $first_surname = trim($_POST["first_surname"]);
        $second_surname = trim($_POST["second_surname"]);
        $ascription = trim($_POST["ascription"]);

        // Leer el archivo PDF
        $pdfData = file_get_contents($_FILES["pdfFile"]["tmp_name"]);
        $pdfFilename = $_FILES["pdfFile"]["name"];

        // Insertar en la base de datos
        $stmt = $pdo->prepare("INSERT INTO collector (`names`, `first_surname`, `second_surname`, `ascription`, `pdf_file`, `pdf_filename`) 
        VALUES (:name, :first_surname, :second_surname, :ascription, :pdf_file, :pdf_filename)");

        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":first_surname", $first_surname);
        $stmt->bindParam(":second_surname", $second_surname);
        $stmt->bindParam(":ascription", $ascription);
        $stmt->bindParam(":pdf_file", $pdfData, PDO::PARAM_LOB);
        $stmt->bindParam(":pdf_filename", $pdfFilename);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Colector registrado exitosamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error en el registro"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error: Método no permitido"]);
}
?>
