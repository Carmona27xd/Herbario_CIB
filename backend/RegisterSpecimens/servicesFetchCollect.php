<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';

$datos = array();

try {
    // Consulta del pais
    $sql = "SELECT idPais, nombre FROM pais";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()) {
        $datos['pais'][] = $row; 
    }

    // Consulta del estado
    $sql = "SELECT idEstado, nombre FROM estado";
    $result = $conexion->query($sql); 

    while ($row = $result->fetch_assoc()) {
        $datos['estado'][] = $row; 
    }

    // Consulta del municipio
    $sql = "SELECT idMunicipio, nombre FROM municipio";
    $result = $conexion->query($sql); 

    while ($row = $result->fetch_assoc()) {
        $datos['municipio'][] = $row; 
    }

    // Consulta de la localidad
    $sql = "SELECT idLocalidad, nombre FROM localidad";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['localidad'][] = $row;
    }

    // Consulta del colector
    $sql = "SELECT idColector, nombre FROM colector";
    $result = $conexion->query($sql);

    while ($row = $result->fetch_assoc()){
        $datos['colector'][] = $row;
    }

    echo json_encode($datos); 
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
} finally {
    $conexion->close(); 
}
?>



