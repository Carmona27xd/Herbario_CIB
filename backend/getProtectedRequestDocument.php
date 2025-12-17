<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../database/connectionDB.php';

// 1. Validar parámetros
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$docType = filter_input(INPUT_GET, 'docType', FILTER_SANITIZE_STRING);

if (!$id || !$docType) {
    http_response_code(400);
    die("Error: Parámetros inválidos.");
}

// 2. Mapear tipo de documento a columnas de la BD
// Clave: lo que envía el JS -> Valor: [NombreColumnaBlob, NombreColumnaNombreArchivo]
$columnMap = [
    'compromise' => ['compromise_letter', 'compromise_letter_name'],
    'cv'         => ['cv', 'cv_name'],
    'permit'     => ['collect_permit', 'collect_permit_name'],
    'protocol'   => ['protocol', 'protocol_name'],
    'rec1'       => ['letter_recommendation', 'letter_recommendation_name'],
    'rec2'       => ['letter_recommendation_two', 'letter_recommendation_two_name'],
];

if (!array_key_exists($docType, $columnMap)) {
    http_response_code(400);
    die("Error: Tipo de documento desconocido.");
}

$colBlob = $columnMap[$docType][0];
$colName = $columnMap[$docType][1];

try {
    // 3. Consulta dinámica segura
    // Nota: Los nombres de columna no se pueden pasar como parámetros bind (:param), 
    // pero como vienen de nuestra lista blanca $columnMap, es seguro interpolarlos.
    $sql = "SELECT $colBlob, $colName FROM new_protected_request WHERE id_request = :id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$file || empty($file[$colBlob])) {
        http_response_code(404);
        die("El documento solicitado no existe o está vacío.");
    }

    $filename = $file[$colName] ?: "documento.pdf";

    // 4. Servir el PDF
    header("Content-Type: application/pdf");
    header("Content-Disposition: inline; filename=\"{$filename}\"");
    header("Content-Length: " . strlen($file[$colBlob]));
    
    echo $file[$colBlob];
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    die("Error de BD: " . $e->getMessage());
}
?>