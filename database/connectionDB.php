<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";  
$usuario = "root";    
$password = "FinalFantasy_7";       
$base_datos = "herbario_cib";  

$conexion = new mysqli($host, $usuario, $password, $base_datos);

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "connected successfully";
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>
