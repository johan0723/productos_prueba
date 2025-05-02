<?php
$host = 'localhost';
$user = 'root'; 
$password = 'nomelase123'; 
$database = 'productos_db';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
