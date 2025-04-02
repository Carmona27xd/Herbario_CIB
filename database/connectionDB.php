<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";  
$usuario = "root";    
$password = "FinalFantasy_7";       
$base_datos = "herbarium_cib";  

try {
    $pdo = new PDO("mysql:host=$host;dbname=$base_datos", $usuario, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>
