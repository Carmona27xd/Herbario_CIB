<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    if ($conexion->connect_error) {
        throw new Exception("Conexión fallida: " . $conexion->connect_error);
    }

    $sql = "SELECT idEjemplar, NombreCientifico, ClasificacionPlanta, Abundancia FROM VistaEjemplarDetalles";
    $result = $conexion->query($sql);

    if ($result->num_rows > 0) {
        $datos = [];
        while ($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }

        echo json_encode($datos);
    } else {
        echo json_encode(["message" => "No se encontraron datos."]);
    }

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    $conexion->close();
}
?>