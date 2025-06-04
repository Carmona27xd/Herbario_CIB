<?php
// Habilitar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir la clase de conexión (asumiendo que está en el mismo directorio)
require_once '../database/connectionDB.php'; // Ajusta la ruta según sea necesario

// Validación de parámetros
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$type = filter_input(INPUT_GET, 'type', FILTER_SANITIZE_STRING);

// Tipos de documentos permitidos
$validTypes = [
    'curriculum' => ['field' => 'curriculum', 'name' => 'curriculum_name'],
    'permit' => ['field' => 'permit', 'name' => 'permit_name'],
    'letter' => ['field' => 'letter', 'name' => 'letter_name'],
    'proyect' => ['field' => 'proyect', 'name' => 'proyect_name']
];

// Validar parámetros
if (!$id || !isset($validTypes[$type])) {
    http_response_code(400);
    die(json_encode([
        'status' => 'error',
        'message' => 'Parámetros inválidos. Se requiere id (numérico) y type (curriculum|permit|letter|proyect)'
    ]));
}

try {
    // Obtener campos correspondientes al tipo de documento
    $blobField = $validTypes[$type]['field'];
    $nameField = $validTypes[$type]['name'];
    
    // Consulta preparada para seguridad
    $stmt = $pdo->prepare("SELECT $blobField AS filedata, $nameField AS filename 
                          FROM collector_requests
                          WHERE id_request = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si existe el archivo
    if (!$file || empty($file['filedata'])) {
        http_response_code(404);
        die(json_encode([
            'status' => 'error',
            'message' => 'El documento solicitado no existe o está vacío'
        ]));
    }

    // Generar nombre de archivo seguro
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $file['filename']);
    if (empty($filename)) {
        $filename = "documento_{$type}_{$id}.pdf";
    }

    // Configurar headers para PDF
    header("Content-Type: application/pdf");
    header("Content-Disposition: inline; filename=\"{$filename}\"");
    header("Content-Length: " . strlen($file['filedata']));
    header("Cache-Control: private, max-age=3600");
    header("Pragma: no-cache");
    header("Expires: 0");
    
    // Output del contenido del archivo
    echo $file['filedata'];
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        'status' => 'error',
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]));
}
?>