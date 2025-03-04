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

    //Metodo de la especie
    $sql = "SELECT idEspecie, nombre FROM especie";
    $result = $conexion->query($sql); 

    while ($row = $result->fetch_assoc()) {
        $datos['especie'][] = $row; 
    }

    //Metodo de la forma biologica
    $sql = "SELECT idFormaBiologica, nombre FROM formabiologica";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['formabiologica'][] = $row;
    }

    //Metodo del tipo de vegetacion
    $sql = "SELECT idTipoVegetacion, nombre FROM tipovegetacion";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['tipovegetacion'][] = $row;
    }

    //Metodo del suelo
    $sql = "SELECT idSuelo, nombre FROM suelo";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['suelo'][] = $row;
    }

    //Metodo del fruto
    $sql = "SELECT idFruto, nombre FROM fruto";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['fruto'][] = $row;
    }

    //Metodo de la flor
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



