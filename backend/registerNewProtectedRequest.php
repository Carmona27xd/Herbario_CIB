<?php
// Configuración de cabeceras y reporte de errores
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0); // Desactivar output de errores en el cuerpo de respuesta para no romper el JSON

// Incluir conexión a la base de datos
require_once '../database/connectionDB.php'; // Asegúrate de que la ruta sea correcta

$response = [];

try {
    // 1. Verificar método de solicitud
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido.', 405);
    }

    // 2. Validar que existan los campos obligatorios de texto
    $requiredFields = ['id_specimens', 'name', 'first_names', 'email', 'status'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("El campo '$field' es obligatorio.");
        }
    }

    // 3. Función auxiliar para procesar archivos
    function getFileData($fileInputName) {
        if (!isset($_FILES[$fileInputName]) || $_FILES[$fileInputName]['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Error al subir el archivo: $fileInputName");
        }
        
        $tmpName = $_FILES[$fileInputName]['tmp_name'];
        $fileName = $_FILES[$fileInputName]['name'];
        $fileType = $_FILES[$fileInputName]['type'];
        $fileSize = $_FILES[$fileInputName]['size'];

        // Validar que sea PDF
        if ($fileType !== 'application/pdf') {
            throw new Exception("El archivo $fileName debe ser un PDF.");
        }

        // Validar tamaño (Ejemplo: Máximo 10MB)
        if ($fileSize > 10 * 1024 * 1024) {
            throw new Exception("El archivo $fileName excede el tamaño máximo permitido (10MB).");
        }

        // Leer contenido binario
        $content = file_get_contents($tmpName);
        return [
            'name' => $fileName,
            'content' => $content
        ];
    }

    // 4. Procesar los 6 archivos requeridos
    // Los nombres de los inputs aquí deben coincidir con los que enviamos en el FormData del JS (getDbBlobName)
    $compromise = getFileData('compromise_letter');
    $cv = getFileData('cv');
    $permit = getFileData('collect_permit');
    $rec1 = getFileData('letter_recommendation');
    $rec2 = getFileData('letter_recommendation_two');
    $protocol = getFileData('protocol');

    // 5. Preparar la consulta SQL
    // Nota: Asumo que agregaste la columna 'email' a tu tabla. Si no, elimínala de esta lista.
    $sql = "INSERT INTO new_protected_request (
                id_specimens, name, first_names, email,
                compromise_letter, compromise_letter_name,
                cv, cv_name,
                collect_permit, collect_permit_name,
                letter_recommendation, letter_recommendation_name,
                letter_recommendation_two, letter_recommendation_two_name,
                protocol, protocol_name,
                reference_one_name, reference_one_email, reference_one_phone,
                reference_two_name, reference_two_email, reference_two_phone,
                status
            ) VALUES (
                :id_specimens, :name, :first_names, :email,
                :compromise_letter, :compromise_letter_name,
                :cv, :cv_name,
                :collect_permit, :collect_permit_name,
                :letter_recommendation, :letter_recommendation_name,
                :letter_recommendation_two, :letter_recommendation_two_name,
                :protocol, :protocol_name,
                :ref1_name, :ref1_email, :ref1_phone,
                :ref2_name, :ref2_email, :ref2_phone,
                :status
            )";

    $stmt = $pdo->prepare($sql);

    // 6. Vincular parámetros (Binding)
    
    // Datos principales
    $stmt->bindParam(':id_specimens', $_POST['id_specimens']);
    $stmt->bindParam(':name', $_POST['name']);
    $stmt->bindParam(':first_names', $_POST['first_names']);
    $stmt->bindParam(':email', $_POST['email']);
    $stmt->bindParam(':status', $_POST['status']);

    // Archivos (BLOBs y Nombres) - Usamos PDO::PARAM_LOB para los binarios
    $stmt->bindParam(':compromise_letter', $compromise['content'], PDO::PARAM_LOB);
    $stmt->bindParam(':compromise_letter_name', $compromise['name']);

    $stmt->bindParam(':cv', $cv['content'], PDO::PARAM_LOB);
    $stmt->bindParam(':cv_name', $cv['name']);

    $stmt->bindParam(':collect_permit', $permit['content'], PDO::PARAM_LOB);
    $stmt->bindParam(':collect_permit_name', $permit['name']);

    $stmt->bindParam(':letter_recommendation', $rec1['content'], PDO::PARAM_LOB);
    $stmt->bindParam(':letter_recommendation_name', $rec1['name']);

    $stmt->bindParam(':letter_recommendation_two', $rec2['content'], PDO::PARAM_LOB);
    $stmt->bindParam(':letter_recommendation_two_name', $rec2['name']);

    $stmt->bindParam(':protocol', $protocol['content'], PDO::PARAM_LOB);
    $stmt->bindParam(':protocol_name', $protocol['name']);

    // Referencias
    $stmt->bindParam(':ref1_name', $_POST['reference_one_name']);
    $stmt->bindParam(':ref1_email', $_POST['reference_one_email']);
    $stmt->bindParam(':ref1_phone', $_POST['reference_one_phone']);

    $stmt->bindParam(':ref2_name', $_POST['reference_two_name']);
    $stmt->bindParam(':ref2_email', $_POST['reference_two_email']);
    $stmt->bindParam(':ref2_phone', $_POST['reference_two_phone']);

    // 7. Ejecutar consulta
    if ($stmt->execute()) {
        $response = [
            "success" => true,
            "message" => "Solicitud registrada correctamente.",
            "id_request" => $pdo->lastInsertId()
        ];
    } else {
        throw new Exception("Error al insertar en la base de datos.");
    }

} catch (Exception $e) {
    // Manejo de errores generales y de base de datos
    http_response_code(500);
    $response = [
        "success" => false,
        "message" => $e->getMessage()
    ];
} catch (PDOException $e) {
    // Errores específicos de PDO
    http_response_code(500);
    $response = [
        "success" => false,
        "message" => "Error de base de datos: " . $e->getMessage()
    ];
}

// Enviar respuesta JSON
echo json_encode($response);
exit;
?>