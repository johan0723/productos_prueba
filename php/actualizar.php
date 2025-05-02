<?php
header('Content-Type: application/json');
include 'conexion.php';

// Recibimos los datos del formulario
$id = $_POST['id'];
$nombre = $_POST['nombre'];
$descripcion = $_POST['descripcion'];
$precio = $_POST['precio'];

// Revisamos si se subio una imagen nueva
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    // Guardamos la imagen en la carpeta /imagenes
    $nombreImagen = basename($_FILES['imagen']['name']);
    $rutaCarpeta = __DIR__ . '/../imagenes/';
    if (!is_dir($rutaCarpeta)) {
        mkdir($rutaCarpeta, 0777, true);
    }
    $rutaImagen = $rutaCarpeta . $nombreImagen;
    $rutaParaBD = 'imagenes/' . $nombreImagen;

    // Movemos la imagen subida a la carpeta final
    if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaImagen)) {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar la imagen']);
        exit;
    }

    // Actualizamos el producto incluyendo la imagen
    $sql = "UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $nombre, $descripcion, $precio, $rutaParaBD, $id);
} else {
    // Actualizamos el producto sin cambiar la imagen
    $sql = "UPDATE productos SET nombre=?, descripcion=?, precio=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $nombre, $descripcion, $precio, $id);
}

// Ejecutamos la consulta y devolvemos el resultado
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$conn->close();
?>