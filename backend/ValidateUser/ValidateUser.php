<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

session_start();

$userType = $_SESSION['user_type'] ?? 'visitante';

if ($userType === 'visitante') {
    http_response_code(403);
    echo json_encode(['error' => 'Debes iniciar sesión para acceder a esta función.']);
    exit;
}
?>




