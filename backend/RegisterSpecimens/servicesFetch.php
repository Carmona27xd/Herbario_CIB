<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';

$datos = array();

try {
    // Método de la familia
    $sql = "SELECT idFamilia, nombre FROM familia";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()) {
        $datos['familia'][] = $row; 
    }

    // Método del género 
    $sql = "SELECT idGenero, nombre FROM genero";
    $result = $conexion->query($sql); 

    while ($row = $result->fetch_assoc()) {
        $datos['genero'][] = $row; 
    }

    echo json_encode($datos); 
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
} finally {
    $conexion->close(); 
}
?>



