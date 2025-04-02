<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';  

$datos = array();

try {
    $tables = [
        'family' => 'idFamily, name',
        'genus' => 'idGenus, name',
        'species' => 'idSpecies, name',
        'biologicalForm' => 'idBiologicalForm, name',
        'vegetationType' => 'idVegetationType, name',
        'soil' => 'idSoil, name',
        'fruit' => 'idFruit, name',
        'flower' => 'idFlower, name',
        'plantClassification' => 'idPlantClassification, name',
        'abundance' => 'idAbundance, name',
        'state' => 'idState, name',
        'municipality' => 'idMunicipality, name',
        'locality' => 'idLocality, name',
        'collector' => 'id_collector, names',
        'microhabitat' => 'idMicrohabitat, name'
    ];

    foreach ($tables as $table => $columns) {
        $sql = "SELECT $columns FROM $table";
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        $datos[$table] = $stmt->fetchAll(PDO::FETCH_ASSOC); 
    }

    echo json_encode($datos);  

} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));  
}
?>



