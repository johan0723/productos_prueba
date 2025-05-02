<?php
// Indicamos que la respuesta sera JSON
header('Content-Type: application/json');

// Conectamos a la base de datos
include 'conexion.php';

// Obtenemos los datos enviados por el formulario
$nombre = $_POST['nombre'];
$descripcion = $_POST['descripcion'];
$precio = $_POST['precio'];

// Revisamos si se subio una imagen
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    // Revisamos que el archivo sea una imagen JPG o PNG
    $tiposPermitidos = ['image/jpeg', 'image/png'];
    if (!in_array($_FILES['imagen']['type'], $tiposPermitidos)) {
        echo json_encode(['success' => false, 'error' => 'Solo se permiten imagenes JPG o PNG']);
        exit;
    }

    // Guardamos la imagen en la carpeta "imagenes"
    $nombreImagen = basename($_FILES['imagen']['name']);
    $carpetaImagenes = __DIR__ . '/../imagenes/';
    if (!is_dir($carpetaImagenes)) {
        mkdir($carpetaImagenes, 0777, true); // Creamos la carpeta si no existe
    }
    $rutaImagen = $carpetaImagenes . $nombreImagen;
    $rutaParaBD = 'imagenes/' . $nombreImagen;

    // Movemos la imagen subida a la carpeta final
    if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaImagen)) {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar la imagen']);
        exit;
    }

    // Insertamos el producto en la base de datos (usamos consulta preparada)
    $sql = "INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nombre, $descripcion, $precio, $rutaParaBD);

    // Si se inserto correctamente, devolvemos exito
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
} else {
    // Si no se subio imagen, mostramos un error
    echo json_encode(['success' => false, 'error' => 'Debes seleccionar una imagen']);
}

// Cerramos la conexion a la base de datos
$conn->close();
?>