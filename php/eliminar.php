<?php
// Indicamos que la respuesta sera JSON
header('Content-Type: application/json');

// Conectamos a la base de datos
include 'conexion.php';

// Obtenemos el ID del producto a eliminar desde la URL (por GET)
$id = $_GET['id'];

// Creamos la consulta SQL para eliminar el producto con ese ID
$sql = "DELETE FROM productos WHERE id = $id";

// Ejecutamos la consulta y devolvemos el resultado en formato JSON
if ($conn->query($sql) === TRUE) {
    // Si se elimino correctamente, devolvemos exito
    echo json_encode(['success' => true]);
} else {
    // Si hubo un error, lo devolvemos
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

// Cerramos la conexion a la base de datos
$conn->close();
?>