function formatearMoneda(valor, moneda = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2, // Asegura que siempre haya dos decimales
  }).format(valor);
}


const container = document.querySelector('.productos-mas-vendidos')


const RESULTS_PER_PAGE = 3

fetch("./productos_mas_vendidos.json") /* fetch es asíncrono */
  .then((response) => {
    return response.json();
  })
  .then((productos) => {
    productos.forEach(productos => {
      const article = document.createElement('article')
      const precioPublicoFormateado = formatearMoneda(productos.Precio_público);
      const precioMayoristaFormateado = formatearMoneda(productos.Precio_mayorista);

      article.className = 'productos_mas_vendidos_tarjeta'

      article.innerHTML = `<div>
          <div class="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
            <div class="flex items-stretch p-4 gap-3"> 
              <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">    
                <div
                    class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                    style='background-image: url(${productos.Imagen});'
                ></div>
                
                <p class="text-[#1b140e] text-base font-medium leading-normal">${productos.Producto}</p>
                <small>${productos.Código} | ${productos.Categoría}</small>
                <p>${productos.Descripción}</p>
                <p class="text-[#97734e] text-sm font-normal leading-normal">Precio público ${precioPublicoFormateado} | Precio mayorista ${precioMayoristaFormateado}</p>
                <p class="text-[#47a6b0] text-sm font-normal leading-normal">${productos.Estado}</p>
              </div>
            </div>
          </div>    
        </div>`
        container.appendChild(article)
    })
  });