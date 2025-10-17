// === FUNCIONES AUXILIARES ===
function formatearMoneda(valor, moneda = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(valor);
}

// === SELECTORES DE ELEMENTOS DEL DOM ===
const productContainer = document.querySelector('#contenedor-todos');
const paginationContainer = document.querySelector('#pagination-nav-todos');

// === ESTADO Y CONFIGURACIÓN DE LA PAGINACIÓN ===
let allProducts = [];
let currentPage = 1;
const productsPerPage = 30;

/**
 * Muestra los productos correspondientes a una página específica.
 * @param {number} page - El número de la página a mostrar.
 */
function displayProducts(page) {
  currentPage = page;
  productContainer.innerHTML = '';

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  paginatedProducts.forEach(producto => {
    const productCard = document.createElement('div');
    productCard.className = 'flex flex-col gap-2 rounded-lg shadow-lg overflow-hidden bg-white';
    const precioPublicoFormateado = formatearMoneda(producto.Precio_público);
    const precioMayoristaFormateado = formatearMoneda(producto.Precio_mayorista);

    productCard.innerHTML = `
      <div class="w-full h-48 bg-center bg-cover" style="background-image: url('${producto.Imagen}');"></div>
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

  // Llama a la nueva y mejorada función de paginación.
  setupSmartPagination();
}
// ==================================================================
// NUEVA LÓGICA DE PAGINACIÓN INTELIGENTE
// ==================================================================

/**
 * Crea un botón de paginación individual (un número, "Anterior" o "Siguiente").
 * @param {object} config - Objeto de configuración.
 * @returns {HTMLAnchorElement} - El elemento <a> del botón.
 */
function createPageButton({ page, text, isActive = false, isDisabled = false, onClick }) {
  const button = document.createElement('a');
  button.href = '#';
  button.innerText = text || page;
  button.className = 'px-4 py-2 mx-1 border rounded-md transition-colors duration-200';

  if (isDisabled) {
    button.className += ' text-gray-400 bg-gray-100 cursor-not-allowed';
  } else if (isActive) {
    button.className += ' bg-[#1b140e] text-white border-[#1b140e] cursor-default';
  } else {
    button.className += ' text-[#1b140e] bg-white hover:bg-gray-100';
  }

  button.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isDisabled && !isActive) {
      onClick(page);
    }
  });
  return button;
}

/**
 * Crea el elemento de puntos suspensivos "...".
 * @returns {HTMLSpanElement}
 */
function createEllipsis() {
  const ellipsis = document.createElement('span');
  ellipsis.innerText = '...';
  ellipsis.className = 'px-4 py-2 mx-1 text-gray-500';
  return ellipsis;
}

/**
 * Genera y muestra la paginación inteligente.
 */
function setupSmartPagination() {
  paginationContainer.innerHTML = '';
  const pageCount = Math.ceil(allProducts.length / productsPerPage);
  const siblingCount = 1; // Cuántos números mostrar a cada lado de la página actual.

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    displayProducts(page);
    window.scrollTo(0, 0);
  };

  // 1. Botón "Anterior"
  paginationContainer.appendChild(createPageButton({
    page: currentPage - 1,
    text: 'Anterior',
    isDisabled: currentPage === 1,
    onClick: handlePageChange
  }));

  // Lógica principal para decidir qué números mostrar
  if (pageCount <= 5) { // Si hay 5 páginas o menos, muéstralas todas.
    for (let i = 1; i <= pageCount; i++) {
      paginationContainer.appendChild(createPageButton({
        page: i,
        isActive: i === currentPage,
        onClick: handlePageChange
      }));
    }
  } else {
    // Muestra el primer botón de página
    paginationContainer.appendChild(createPageButton({ page: 1, isActive: currentPage === 1, onClick: handlePageChange }));

    // Muestra la primera elipsis si es necesario
    if (currentPage > siblingCount + 2) {
      paginationContainer.appendChild(createEllipsis());
    }

    // Muestra las páginas alrededor de la actual
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(pageCount - 1, currentPage + siblingCount);

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createPageButton({
        page: i,
        isActive: i === currentPage,
        onClick: handlePageChange
      }));
    }

    // Muestra la segunda elipsis si es necesario
    if (currentPage < pageCount - siblingCount - 1) {
      paginationContainer.appendChild(createEllipsis());
    }

    // Muestra el último botón de página
    if (pageCount > 1) {
        paginationContainer.appendChild(createPageButton({ page: pageCount, isActive: currentPage === pageCount, onClick: handlePageChange }));
    }
  }

  // 3. Botón "Siguiente"
  paginationContainer.appendChild(createPageButton({
    page: currentPage + 1,
    text: 'Siguiente',
    isDisabled: currentPage === pageCount,
    onClick: handlePageChange
  }));
}

// === INICIO DE LA CARGA DE DATOS ===
fetch("./json/productos_todos.json") // Asegúrate que la ruta a tu JSON es correcta.
  .then(response => response.json())
  .then(data => {
    allProducts = data; // Guarda todos los productos en el array global.
    displayProducts(1); // Muestra la primera página por defecto.
  })
  .catch(error => {
    console.error("Error al cargar el archivo de productos:", error);
    productContainer.innerHTML = `<p class="text-red-500">Hubo un error al cargar los productos. Por favor, intenta más tarde.</p>`;
  });