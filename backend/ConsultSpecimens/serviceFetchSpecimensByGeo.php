<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/connectionDB.php';
require '../../vendor/autoload.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $conditions = [];
    $params = [];

    if (!empty($input['idState'])) {
        $conditions[] = 'idState = :idState';
        $params[':idState'] = $input['idState'];
    }
    if (!empty($input['idMunicipality'])) {
        $conditions[] = 'idMunicipality = :idMunicipality';
        $params[':idMunicipality'] = $input['idMunicipality'];
    }
    if (!empty($input['idLocality'])) {
        $conditions[] = 'idLocality = :idLocality';
        $params[':idLocality'] = $input['idLocality'];
    }
    if (!empty($input['altitude']) && !empty($input['operator'])) {
        $allowedOperators = ['<=', '>=', '='];
        if (in_array($input['operator'], $allowedOperators)) {
            $conditions[] = "altitude {$input['operator']} :altitude";
            $params[':altitude'] = $input['altitude'];
        }
    }

    $sql = "SELECT * FROM vista_ejemplares_geograficos";
    if (!empty($conditions)) {
        $sql .= ' WHERE ' . implode(' AND ', $conditions);
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($results);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}