// REFERENCIAS A ELEMENTOS DEL HTML
  const formularioProducto = document.getElementById('formAddProduct');
  const botonMostrarFormulario = document.getElementById('btnMostrarFormulario');
  const botonEnviar = formularioProducto.querySelector('button[type="submit"]');
  const imagenVistaPrevia = document.getElementById('imagenActual');
  const inputImagen = document.getElementById('imagen');

  // Variables de control para edicion
  let enModoEdicion = false;       
  let idProductoEditando = null;   

  // Ocultar el formulario al iniciar la pagina
  formularioProducto.style.display = 'none';


  // MOSTRAR U OCULTAR FORMULARIO MANUALMENTE
  botonMostrarFormulario.addEventListener('click', function() {
    if (formularioProducto.style.display === 'none' || formularioProducto.style.display === '') {
      // Mostrar el formulario
      formularioProducto.style.display = 'block';
      botonMostrarFormulario.textContent = 'Ocultar formulario';
    } else {
      // Ocultar el formulario y limpiar los campos
      formularioProducto.style.display = 'none';
      botonMostrarFormulario.textContent = 'Agregar producto';
      limpiarFormulario(); // Reinicia el formulario si estaba visible
    }
  });


  // VISTA PREVIA DE LA IMAGEN AL SELECCIONAR ARCHIVO
  inputImagen.addEventListener('change', function (e) {
    const archivo = e.target.files[0]; // Obtener el archivo seleccionado
    if (archivo) {
      const lector = new FileReader(); // Crear un lector de archivos
      lector.onload = function (ev) {
        // Mostrar la imagen cargada como vista previa
        imagenVistaPrevia.src = ev.target.result;
        imagenVistaPrevia.style.display = 'block';
      };
      lector.readAsDataURL(archivo); // Leer el archivo como URL
    } else {
      // Si no se selecciona imagen, ocultar vista previa
      imagenVistaPrevia.src = '';
      imagenVistaPrevia.style.display = 'none';
    }
  });


  // GESTIÓN DEL ENVIO DEL FORMULARIO (AGREGAR O EDITAR)
  formularioProducto.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir envio por defecto del formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const archivoImagen = inputImagen.files[0]; // Archivo de imagen

    // Crear objeto FormData para enviar por POST (soporta archivos)
    const datosFormulario = new FormData();
    datosFormulario.append('nombre', nombre);
    datosFormulario.append('descripcion', descripcion);
    datosFormulario.append('precio', precio);

    // Si estamos editando un producto existente
    if (enModoEdicion) {
      datosFormulario.append('id', idProductoEditando); // Incluir el ID
      if (archivoImagen) datosFormulario.append('imagen', archivoImagen); // Incluir imagen si se cambio

      // Enviar los datos al backend PHP para actualizar
      fetch('php/actualizar.php', {
        method: 'POST',
        body: datosFormulario
      })
        .then(respuesta => respuesta.json()) // Convertir la respuesta a JSON
        .then(datos => {
          if (datos.success) {
            alert('Producto actualizado exitosamente');
            cargarProductos();    // Recargar la lista de productos
            limpiarFormulario();  // Reiniciar el formulario
          } else {
            alert('Error al actualizar el producto: ' + (datos.error || ''));
          }
        })
        .catch(error => console.error('Error al actualizar producto:', error));
    } else {
      // Si estamos agregando un nuevo producto
      if (!archivoImagen) {
        alert("Por favor selecciona una imagen."); // Validacion de imagen obligatoria
        return;
      }

      datosFormulario.append('imagen', archivoImagen); // Adjuntar imagen

      // Enviar los datos al backend PHP para agregar
      fetch('php/agregar.php', {
        method: 'POST',
        body: datosFormulario
      })
        .then(respuesta => respuesta.json())
        .then(datos => {
          if (datos.success) {
            alert('Producto añadido exitosamente');
            cargarProductos();
            limpiarFormulario();
          } else {
            alert('Error al añadir el producto: ' + (datos.error || ''));
          }
        })
        .catch(error => console.error('Error al añadir producto:', error));
    }
  });


  // Cargar y mostrar productos desde el backend
  function cargarProductos() {
    fetch('php/listar.php')
      .then(respuesta => respuesta.json())
      .then(productos => {
        const lista = document.getElementById('productList');
        lista.innerHTML = ''; // Limpiar lista existente

        productos.forEach(producto => {
          // Crear elemento de lista para cada producto
          const elemento = document.createElement('li');
          elemento.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width:60px; height:auto; vertical-align:middle; margin-right:10px;">
            <strong>${producto.nombre}</strong> $${producto.precio}<br>
            <em>${producto.descripcion}</em><br>
            <button class="boton-editar">Editar</button>
            <button class="boton-eliminar">Eliminar</button>
          `;
          lista.appendChild(elemento);

          // Boton eliminar producto
          elemento.querySelector('.boton-eliminar').addEventListener('click', function () {
            eliminarProducto(producto.id);
          });

          // Boton editar producto
          elemento.querySelector('.boton-editar').addEventListener('click', function () {
            prepararEdicion(producto);
          });
        });
      })
      .catch(error => console.error('Error al obtener productos:', error));
  }

  // Eliminar producto por ID
  function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      fetch(`php/eliminar.php?id=${id}`, {
        method: 'DELETE',
      })
        .then(respuesta => respuesta.json())
        .then(datos => {
          if (datos.success) {
            alert('Producto eliminado exitosamente');
            cargarProductos(); // Refrescar lista
          } else {
            alert('Error al eliminar el producto: ' + (datos.error || ''));
          }
        })
        .catch(error => console.error('Error al eliminar producto:', error));
    }
  }

  // Preparar formulario con datos de producto a editar
  function prepararEdicion(producto) {
    formularioProducto.style.display = 'block';
    botonMostrarFormulario.textContent = 'Ocultar formulario';

    // Llenar los campos del formulario con los datos del producto
    document.getElementById('nombre').value = producto.nombre || '';
    document.getElementById('descripcion').value = producto.descripcion || '';
    document.getElementById('precio').value = producto.precio || '';

    // Cargar imagen existente como vista previa
    if (producto.imagen) {
      imagenVistaPrevia.src = producto.imagen;
      imagenVistaPrevia.style.display = 'block';
    } else {
      imagenVistaPrevia.src = '';
      imagenVistaPrevia.style.display = 'none';
    }

    // Cambiar botón y activar modo edicion
    botonEnviar.textContent = 'Actualizar Producto';
    enModoEdicion = true;
    idProductoEditando = producto.id;
  }

  // Limpiar todos los campos del formulario y resetear variables
  function limpiarFormulario() {
    formularioProducto.reset(); // Vaciar campos
    botonEnviar.textContent = 'Añadir Producto';
    enModoEdicion = false;
    idProductoEditando = null;

    imagenVistaPrevia.src = '';
    imagenVistaPrevia.style.display = 'none';

    // Si hay algun texto informativo relacionado con la imagen, eliminarlo
    const infoText = document.getElementById('imgInfoText');
    if (infoText) {
      infoText.remove();
    }
  }


  // INICIALIZAR PRODUCTOS
  cargarProductos(); // Cargar los productos al inicio