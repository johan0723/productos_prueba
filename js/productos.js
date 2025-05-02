// Obtiene los productos del backend y los muestra en el carrusel
function listarProductos() {
  fetch('php/listar.php')
    .then(respuesta => respuesta.json())
    .then(productos => {
      const contenedor = document.getElementById('carousel-inner');
      let indice = 0; // Indice del producto actual
      const total = productos.length;

      // Generar el HTML de todos los productos y colocarlo en el contenedor
      contenedor.innerHTML = productos.map(producto => `
        <div class="carousel-item">
          <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <h5 class="producto-nombre">${producto.nombre}</h5>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <p class="producto-precio">$${producto.precio}</p>
          </div>
        </div>
      `).join('');

      // Mueve el carrusel al producto actual segun el indice     
      function actualizarCarrusel() {
        contenedor.style.transform = `translateX(-${indice * 100}%)`;
      }

      
      // Cambia el indice al anterior y actualiza el carrusel
      function irAnterior() {
        indice = (indice === 0) ? total - 1 : indice - 1;
        actualizarCarrusel();
      }

      // Cambia el indice al siguiente y actualiza el carrusel
      function irSiguiente() {
        indice = (indice === total - 1) ? 0 : indice + 1;
        actualizarCarrusel();
      }

      // Asignar eventos a los botones de navegacion
      const btnAnterior = document.getElementById('prevBtn');
      const btnSiguiente = document.getElementById('nextBtn');
      btnAnterior.addEventListener('click', irAnterior);
      btnSiguiente.addEventListener('click', irSiguiente);

      // Cambio automatico de producto cada 5 segundos
      setInterval(irSiguiente, 5000);

      // Mostrar el primer producto al inicio
      actualizarCarrusel();
    })
    .catch(error => {
      // Si hay un error, lo mostramos en la consola
      console.error('Error al obtener productos:', error);
    });
}

// Ejecutar la funcion al cargar la pagina
listarProductos();
