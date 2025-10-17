function formatearMoneda(valor, moneda = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(valor);
}

// === SELECTORES ===
const productContainer = document.querySelector('#contenedor-mas-vendidos');
const paginationContainer = document.querySelector('#pagination-nav');

// === ESTADO DE LA PAGINACIÓN ===
let allProducts = []; // Array para guardar TODOS los productos del JSON
let currentPage = 1; // Página actual, empezamos en la 1
const productsPerPage = 3; // Cuántos productos mostrar por página

/**
 * Función para mostrar los productos de una página específica
 */
function displayProducts(page) {
  currentPage = page;
  // Limpiamos el contenedor antes de añadir nuevos productos
  productContainer.innerHTML = '';

  // Calculamos qué productos mostrar
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  // Creamos y añadimos las tarjetas de los productos para la página actual
  paginatedProducts.forEach(producto => {
    const productCard = document.createElement('div');
    productCard.className = 'flex flex-col gap-2 rounded-lg shadow-lg overflow-hidden bg-white';
    
    const precioPublicoFormateado = formatearMoneda(producto.Precio_público);
    const precioMayoristaFormateado = formatearMoneda(producto.Precio_mayorista);

    productCard.innerHTML = `
      <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col" style="background-image: url('${producto.Imagen}');"></div>
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="text-lg font-bold text-[#1b140e]">${producto.Producto}</h3>
        <small class="text-gray-500 mb-2">${producto.Código} | ${producto.Categoría}</small>
        <p class="text-gray-700 text-sm mb-4 flex-grow">${producto.Descripción}</p>
        <p class="text-sm font-semibold text-[#97734e] mb-2">Público ${precioPublicoFormateado} | Mayorista ${precioMayoristaFormateado}</p>
        <p class="text-sm font-bold text-[#47a6b0]">${producto.Estado}</p>
      </div>
    `;
    productContainer.appendChild(productCard);
  });
  
  // Actualizamos los botones de paginación para reflejar la página activa
  setupPagination();
}

/**
 * Función para crear y mostrar los botones de paginación
 */
function setupPagination() {
  // Limpiamos los botones viejos
  paginationContainer.innerHTML = '';
  
  // Calculamos el número total de páginas
  const pageCount = Math.ceil(allProducts.length / productsPerPage);

  // Creamos un botón para cada página
  for (let i = 1; i <= pageCount; i++) {
    const pageButton = document.createElement('a');
    pageButton.href = '#';
    pageButton.innerText = i;
    // Estilos para los botones (puedes personalizarlos)
    pageButton.className = 'px-3 py-1 mx-1 border rounded';

    // Si es la página actual, le damos un estilo diferente
    if (i === currentPage) {
      pageButton.classList.add('bg-[#1b140e]', 'text-white'); // Clase 'is-active'
    } else {
      pageButton.classList.add('text-[#1b140e]', 'bg-white');
    }

    // Añadimos el evento para que cambie de página al hacer clic
    pageButton.addEventListener('click', (e) => {
      e.preventDefault(); // Evitamos que el link recargue la página
      displayProducts(i);
    });

    paginationContainer.appendChild(pageButton);
  }
}

// === INICIO DE LA APLICACIÓN ===
fetch("./json/productos_mas_vendidos.json")
  .then((response) => response.json())
  .then((productos) => {
    // 1. Guardamos todos los productos en nuestro array global
    allProducts = productos;
    
    // 2. Mostramos la primera página de productos por defecto
    displayProducts(1);
  })
  .catch(error => {
    console.error("Error al cargar los productos:", error);
    productContainer.innerHTML = "<p>No se pudieron cargar los productos.</p>";
  });