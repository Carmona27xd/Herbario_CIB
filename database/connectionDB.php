<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";  
$username = "root";    
$password = "password";       
$dbname = "herbario";  

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "connected successfully";
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>
