<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
include '../database/connectionDB.php'; 

try {
    // --- CORRECCIÓN 1: Añadir 'created_at' a la consulta ---
    $stmt = $pdo->prepare(
        "SELECT id_request, name, first_surname, second_surname, email, 
                ref_name, ref_first_surname, ref_second_surname, 
                ref_email, curriculum_name, permit_name, letter_name, proyect_name, 
                created_at, status
         FROM collector_requests"
    );
    $stmt->execute();

    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // --- CORRECCIÓN 2: Formatear la salida como espera el JS ---
    echo json_encode(["success" => true, "data" => $requests]);

} catch (PDOException $e) {
    http_response_code(500); // Es buena práctica enviar un código de error
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>