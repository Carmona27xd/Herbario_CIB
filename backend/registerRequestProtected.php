<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

include '../database/connectionDB.php'; // Asegúrate de que esto cree la variable $pdo

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- 1. VALIDACIÓN DE DATOS ---

    // Validar campos de texto
    if (!isset($_POST["idSpecimen"], $_POST["name"], $_POST["email"], $_POST["description"], $_POST["status"])) {
        echo json_encode(["success" => false, "message" => "Datos de texto incompletos"]);
        exit;
    }

    // Validar el archivo (el 'name' "attachment" debe coincidir con tu JS)
    if (!isset($_FILES['attachment']) || $_FILES['attachment']['error'] !== UPLOAD_ERR_OK) {
        // UPLOAD_ERR_OK significa que el archivo se subió sin errores
        echo json_encode(["success" => false, "message" => "Error al subir el archivo PDF o no se adjuntó."]);
        exit;
    }

    $pdfTmpName = $_FILES['attachment']['tmp_name'];
    $pdfOriginalName = $_FILES['attachment']['name'];

    // Obtener datos de texto
    $idSpecimen = trim($_POST["idSpecimen"]);
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $description = trim($_POST["description"]);
    $status = trim($_POST["status"]);

    try {
        // Leer el contenido del archivo PDF para guardarlo en el BLOB
        $pdfContent = file_get_contents($pdfTmpName);

        // Preparar la consulta SQL COMPLETA
        $stmt = $pdo->prepare("INSERT INTO protected_request 
            (id_specimen, `name`, email, `description`, `status`, pdf_file, pdf_name) 
            VALUES (:id_specimen, :name, :email, :description, :status, :pdf_file, :pdf_name)");

        // Bind de parámetros (incluyendo el BLOB)
        $stmt->bindParam(":id_specimen", $idSpecimen);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":pdf_name", $pdfOriginalName); // Tu columna NVARCHAR
        $stmt->bindParam(":pdf_file", $pdfContent, PDO::PARAM_LOB); // Tu columna BLOB

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Solicitud registrada con éxito."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al ejecutar la consulta."]);
        }

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error de base de datos: " . $e->getMessage()]);
    } catch (Exception $e) { // Captura otros errores (como file_get_contents)
        echo json_encode(["success" => false, "message" => "Error del servidor: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Método de solicitud no permitido"]);
}
?>