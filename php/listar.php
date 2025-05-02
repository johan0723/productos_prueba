<?php
header('Content-Type: application/json'); // Indicamos que la respuesta sera JSON

include 'conexion.php'; // Incluimos el archivo de conexion a la base de datos ($conn)

// Consulta SQL para obtener todos los productos
$sql = "SELECT * FROM productos";
$resultado = $conn->query($sql);

// Creamos un array para guardar los productos
$productos = [];

// Si hay productos en la base de datos, los agregamos al array
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $productos[] = $fila;
    }
}

// Devolvemos el array de productos como JSON
echo json_encode($productos);

// Cerramos la conexión a la base de datos
$conn->close();
?>
