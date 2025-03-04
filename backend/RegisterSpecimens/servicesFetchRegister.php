<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';

$datos = array();

try {
    // Consulta de la familia
    $sql = "SELECT idFamilia, nombre FROM familia";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()) {
        $datos['familia'][] = $row; 
    }

    // Consulta del género 
    $sql = "SELECT idGenero, nombre FROM genero";
    $result = $conexion->query($sql); 

    while ($row = $result->fetch_assoc()) {
        $datos['genero'][] = $row; 
    }

    // Consulta de la especie
    $sql = "SELECT idEspecie, nombre FROM especie";
    $result = $conexion->query($sql); 

    while ($row = $result->fetch_assoc()) {
        $datos['especie'][] = $row; 
    }

    // Consulta de la forma biologica
    $sql = "SELECT idFormaBiologica, nombre FROM formabiologica";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['formabiologica'][] = $row;
    }

    // Consulta del tipo de vegetacion
    $sql = "SELECT idTipoVegetacion, nombre FROM tipovegetacion";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['tipovegetacion'][] = $row;
    }

    // Consulta del suelo
    $sql = "SELECT idSuelo, nombre FROM suelo";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['suelo'][] = $row;
    }

    // Consulta del fruto
    $sql = "SELECT idFruto, nombre FROM fruto";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['fruto'][] = $row;
    }

    // Consulta de la flor
    $sql = "SELECT idFlor, nombre FROM flor";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['flor'][] = $row;
    }

    echo json_encode($datos); 
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
} finally {
    $conexion->close(); 
}
?>



