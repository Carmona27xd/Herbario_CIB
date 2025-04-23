<?php
require '../database/connectionDB.php'; 
require '../vendor/autoload.php';

$email = 'admin@example.com';
$password = '123456'; 
$name = 'Juan';
$first_surname = 'Pérez';
$second_surname = 'Gómez';
$role_id = 2; 

$stmtRole = $pdo->prepare("SELECT COUNT(*) FROM roles WHERE role_id = :role_id");
$stmtRole->execute(['role_id' => $role_id]);
$roleExists = $stmtRole->fetchColumn();

if ($roleExists) {
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (email, password, name, first_surname, second_surname, role_id) VALUES (:email, :password, :name, :first_surname, :second_surname, :role_id)");

    if ($stmt->execute([
        ':email' => $email,
        ':password' => $passwordHash,
        ':name' => $name,
        ':first_surname' => $first_surname,
        ':second_surname' => $second_surname,
        ':role_id' => $role_id
    ])) {
        echo "Usuario insertado correctamente.";
    } else {
        echo "Error al insertar el usuario.";
    }
} else {
    echo "Error: El role_id $role_id no existe en la tabla roles.";
}
?>