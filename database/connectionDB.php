<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";  
$usuario = "root";    
$password = "FinalFantasy_7";       
$base_datos = "herbariouv";  

$conexion = new mysqli($host, $usuario, $password, $base_datos);

if ($conexion->connect_error) {
    die("Error en la conexión: " . $conexion->connect_error);
}
?>
