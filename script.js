function toggleMenu() {
    var nav = document.getElementById('nav-list');
    nav.classList.toggle('active');
}

/* =========================================
   SISTEMA DE GALERÍA Y MOSAICO INTELIGENTE
========================================= */

// 1. GENERAR BASE DE DATOS (.jpg en todas)
const repuestos = [];

// Autocompletar del 1 al 60 (Se asigna la extensión .jpg)
for(let i = 1; i <= 60; i++) {
    repuestos.push({
        codigo: `REP-${i.toString().padStart(3, '0')}`,
        imagen: `${i}.jpg` // Ahora busca específicamente archivos .jpg
    });
}

// 2. OBSERVADOR PARA EFECTO "VANISHING SLIDE" AL HACER SCROLL
const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting) {
            // Añade la clase que dispara la animación en CSS
            entrada.target.classList.add('visible');
            // Deja de observar para que la animación solo ocurra 1 vez
            observer.unobserve(entrada.target); 
        }
    });
}, { 
    threshold: 0.1 // Se dispara cuando el 10% de la imagen es visible
});

// 3. FUNCIÓN QUE RENDERIZA EL MOSAICO Y AUTO-DETECTA DIMENSIONES
function renderGaleria(datos) {
    const grid = document.getElementById('galeria-grid');
    if (!grid) return; 

    grid.innerHTML = ''; 

    datos.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'mosaic-item'; // Clase inicial (animación oculta)
        
        // Solo muestra el código y "Ascencio Diesel" fijo
       div.innerHTML = `
            <img src="${item.imagen}" 
                 alt="Ascencio Diesel" 
                 data-id="${index + 1}" 
                 loading="lazy"> <div class="mosaic-info">
                <span class="code">CÓDIGO: ${item.codigo}</span>
                <h4>Ascencio Diesel</h4>
            </div>
        `;
        
        grid.appendChild(div);
        
        // --- LOGICA DE TAMAÑOS AUTOMATICOS ---
        const imgEl = div.querySelector('img');
        
        // Función que evalua la foto una vez que ha cargado
        const ajustarTamano = function() {
            const ancho = this.naturalWidth;
            const alto = this.naturalHeight;
            const ratio = ancho / alto; // Proporción de la imagen

            // Si es muy ancha (Horizontal) ocupa 2 columnas
            if (ratio > 1.3) {
                div.classList.add('span-col-2'); 
            } 
            // Si es muy alta (Vertical) ocupa 2 filas
            else if (ratio < 0.75) {
                div.classList.add('span-row-2'); 
            }
            // Si es cuadrada y de muy alta resolución, la hacemos gigante (2x2)
            else if (ancho > 800) {
                div.classList.add('span-col-2', 'span-row-2');
            }
        };

        // Si la imagen ya cargó (está en la cache del navegador)
        if (imgEl.complete) {
            ajustarTamano.call(imgEl);
        } else {
            // Esperar a que cargue
            imgEl.onload = ajustarTamano;
            
            // Fallback (Imagen de respaldo) si no tienes subida la foto aún
            imgEl.onerror = function() {
                if(!this.dataset.fallback) {
                    this.dataset.fallback = true; // Evita bucle infinito
                    
                    // Simular aleatoriamente tamaños horizontales o verticales para probar el mosaico
                    const esVertical = Math.random() > 0.6;
                    const esHorizontal = !esVertical && Math.random() > 0.5;
                    
                    let w = 400, h = 400; // Cuadrada por defecto
                    if(esVertical) { w = 400; h = 800; }
                    if(esHorizontal) { w = 800; h = 400; }
                    
                    this.src = `https://placehold.co/${w}x${h}/2C3E50/FFF?text=Foto+${this.getAttribute('data-id')}`;
                }
            };
        }

        // Le decimos al observador que vigile esta nueva foto para el Scroll
        observer.observe(div);
    });
}

// 4. INICIALIZADOR
document.addEventListener('DOMContentLoaded', () => {
    // Ya no hace falta escuchar filtros de búsqueda. Solo renderizamos directamente.
    if (document.getElementById('galeria-grid')) {
        renderGaleria(repuestos);
    }
});

function toggleWhatsApp() {
    const menu = document.getElementById('waMenu');
    menu.classList.toggle('show');
}

// Cerrar el menú si se hace clic fuera de él
window.onclick = function(event) {
    if (!event.target.closest('.whatsapp-container')) {
        const menu = document.getElementById('waMenu');
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    }
}