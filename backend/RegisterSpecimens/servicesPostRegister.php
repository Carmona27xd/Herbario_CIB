<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conexion_path = '../../database/connectionDB.php';
if (file_exists($conexion_path)) {
    include $conexion_path;
} else {
    die(json_encode(['success' => false, 'message' => 'Error: No se encontró connectionDB.php']));
}

// Recoger los datos del POST
$asociada = $_POST['associated'] ?? null;
$cicloVida = $_POST['lifeCycle'] ?? null;
$tamanio = $_POST['size'] ?? null;
$duplicados = $_POST['numberDuplicates'] ?? null;
$otrosDatos = $_POST['otherInformation'] ?? null;
$protegido = $_POST['protected'] ?? null;

// Verificar imágenes antes de acceder a ellas
$imagenEjemplar = isset($_FILES['specimenImage']) && $_FILES['specimenImage']['tmp_name'] ? file_get_contents($_FILES['specimenImage']['tmp_name']) : null;

$idTipoVegetacion = $_POST['typeVegetation'] ?? null;
$idSuelo = $_POST['soil'] ?? null;
$idFormaBiologica = $_POST['biologicalForm'] ?? null;
$idFruto = $_POST['fruit'] ?? null;
$idFlor = $_POST['flower'] ?? null;
$idAbundancia = $_POST['abundance'] ?? null;
$idClasificacionPlanta = $_POST['plantClassification'] ?? null;

$nombreDet = $_POST['determinerName'] ?? null;
$apellidoPaternoDet = $_POST['determinerLastNameP'] ?? ""; // Cadena vacía si no hay datos
$apellidoMaternoDet = $_POST['determinerLastNameM'] ?? ""; // Cadena vacía si no hay datos
$fechaDetermino = date('Y-m-d'); // Fecha actual si no se envía

$numeroColecta = $_POST['collectNumber'] ?? null;
$nombreLocal = $_POST['localName'] ?? null;
$fechaColecta = $_POST['collectDate'] ?? date('Y-m-d'); // Si no se recibe, usa la fecha de hoy
$idMicroHabitat = $_POST['microhabitat'] ?? null;

$imagenLibretaCampo = isset($_FILES['fieldBookImage']) && $_FILES['fieldBookImage']['tmp_name'] ? file_get_contents($_FILES['fieldBookImage']['tmp_name']) : null;

$colectores = $_POST['collector'] ?? null;
$idEstado = $_POST['state'] ?? null;
$idMunicipio = $_POST['municipality'] ?? null;
$idLocalidad = $_POST['locality'] ?? null;

$latitud = $_POST['latitude'] ?? null;
$longitud = $_POST['longitude'] ?? null;
$altitud = $_POST['altitude'] ?? null;

$nombreCient = $_POST['scientificName'] ?? null;
$idFamilia = $_POST['family'] ?? null;
$idGenero = $_POST['genre'] ?? null;
$idEspecie = $_POST['specie'] ?? null;

// Preparar la llamada al procedimiento almacenado
$query = "CALL TP_RegistrarEjemplar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

if ($stmt = $conexion->prepare($query)) {
    // Vincular parámetros
    $stmt->bind_param('sidisibiiiiiiissssissibsiiidddsiii', 
        $asociada, $cicloVida, $tamanio, $duplicados, $otrosDatos, $protegido, 
        $imagenEjemplar, $idTipoVegetacion, $idSuelo, $idFormaBiologica, 
        $idFruto, $idFlor, $idAbundancia, $idClasificacionPlanta, 
        $nombreDet, $apellidoPaternoDet, $apellidoMaternoDet, $fechaDetermino, 
        $numeroColecta, $nombreLocal, $fechaColecta, $idMicroHabitat, $imagenLibretaCampo, 
        $colectores, $idEstado, $idMunicipio, $idLocalidad, 
        $latitud, $longitud, $altitud, $nombreCient, $idFamilia, $idGenero, $idEspecie
    );

    // Ejecutar el procedimiento
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registro exitoso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar los datos: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conexion->error]);
}

$conexion->close(); // Cerrar la conexión
?>
