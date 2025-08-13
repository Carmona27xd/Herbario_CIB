<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";  
$username = "root";    
$password = "FinalFantasy_7";       
$dbname = "herbarium_cib";  

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión: " . $e->getMessage()
    ]);
    exit;
}
?>
