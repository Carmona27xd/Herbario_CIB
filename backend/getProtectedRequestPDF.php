<?php
// Habilitar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir la conexión
require_once '../database/connectionDB.php'; // Ajusta la ruta si es necesario

// Validación de parámetros
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);
    die(json_encode([
        'status' => 'error',
        'message' => 'Parámetro ID inválido o faltante.'
    ]));
}

try {
    // Consulta preparada para la tabla 'protected_request'
    $stmt = $pdo->prepare("SELECT pdf_file, pdf_name 
                            FROM protected_request
                            WHERE id_request = :id");
    
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si existe el archivo
    if (!$file || empty($file['pdf_file'])) {
        http_response_code(404);
        die(json_encode([
            'status' => 'error',
            'message' => 'El documento PDF no existe o está vacío.'
        ]));
    }

    // Usar el nombre de archivo de la BD o un genérico
    $filename = $file['pdf_name'] ?: "documento_{$id}.pdf";

    // Configurar headers para PDF
    header("Content-Type: application/pdf");
    // 'inline' hace que se abra en el navegador en lugar de descargarse
    header("Content-Disposition: inline; filename=\"{$filename}\""); 
    header("Content-Length: " . strlen($file['pdf_file']));
    header("Cache-Control: private, max-age=3600");
    header("Pragma: no-cache");
    header("Expires: 0");
    
    // Imprimir el contenido del BLOB
    echo $file['pdf_file'];
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        'status' => 'error',
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]));
}
?>