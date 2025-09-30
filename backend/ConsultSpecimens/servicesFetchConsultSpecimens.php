<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try {
    $stmtNoProtegidos = $pdo->prepare("SELECT * FROM vista_ejemplares_no_protegidos");
    $stmtNoProtegidos->execute();
    $noProtegidos = $stmtNoProtegidos->fetchAll(PDO::FETCH_ASSOC);

    $stmtProtegidos = $pdo->prepare("SELECT * FROM vista_ejemplares_protegidos");
    $stmtProtegidos->execute();
    $protegidos = $stmtProtegidos->fetchAll(PDO::FETCH_ASSOC);

    foreach ($noProtegidos as &$ejemplar) {
        $ejemplar['protected'] = 0;
    }

    foreach ($protegidos as &$ejemplar) {
        $ejemplar['protected'] = 1;
        $ejemplar['specimenImage'] = ''; 
    }

    $todos = array_merge($noProtegidos, $protegidos);

    header('Content-Type: application/json');
    echo json_encode($todos);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
