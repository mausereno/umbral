// 1. Lógica del Slider del Hero
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

// Iniciar primer slide y setear intervalo
slides[0].classList.add('active');
setInterval(nextSlide, 5000); // Cambia cada 5 segundos


// 2. Intersection Observer para revelado editorial
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Aplicar estilos iniciales y observar
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "all 1s cubic-bezier(0.2, 0.8, 0.2, 1)";
  observer.observe(section);
});

// Clase para activar la animación
const style = document.createElement('style');
style.innerHTML = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('coffee-grid');
  const chipProcesos = document.getElementById('chip-procesos');
  const chipNotas = document.getElementById('chip-notas');

  let productos = [];
  let filtroProcesoActivo = null;
  let filtroNotaActiva = null;

  // 1. Cargar el JSON
  fetch('productos.json')
    .then(response => response.json())
    .then(data => {
      productos = data;
      inicializarFiltros();
      renderizarGrid(productos);
    })
    .catch(error => console.error('Error cargando los cafés:', error));

  // 2. Crear los chips dinámicamente
  function inicializarFiltros() {
    // Extraer procesos únicos (usamos 'Categoría' según tu JSON)
    const categorias = [...new Set(productos.map(p => p.Categoría))];
    
    // Extraer notas únicas
    const todasLasNotas = productos.flatMap(p => p.Notas);
    const notasUnicas = [...new Set(todasLasNotas)];

    // Generar chips de Procesos
    categorias.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = cat;
      btn.onclick = () => alternarFiltro('proceso', cat, btn);
      chipProcesos.appendChild(btn);
    });

    // Generar chips de Notas
    notasUnicas.forEach(nota => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = nota;
      btn.onclick = () => alternarFiltro('nota', nota, btn);
      chipNotas.appendChild(btn);
    });
  }

  // 3. Lógica para activar/desactivar filtros
  function alternarFiltro(tipo, valor, boton) {
    // Manejar estado visual de los botones
    const grupo = tipo === 'proceso' ? chipProcesos : chipNotas;
    
    // Si el botón ya estaba activo, lo desactivamos (toggle)
    if (boton.classList.contains('active')) {
      boton.classList.remove('active');
      if (tipo === 'proceso') filtroProcesoActivo = null;
      if (tipo === 'nota') filtroNotaActiva = null;
    } else {
      // Quitar clase active a los hermanos y dársela a este
      Array.from(grupo.children).forEach(btn => btn.classList.remove('active'));
      boton.classList.add('active');
      
      if (tipo === 'proceso') filtroProcesoActivo = valor;
      if (tipo === 'nota') filtroNotaActiva = valor;
    }

    aplicarFiltros();
  }

  // 4. Filtrar y re-renderizar
  function aplicarFiltros() {
    let filtrados = productos;

    if (filtroProcesoActivo) {
      filtrados = filtrados.filter(p => p.Categoría === filtroProcesoActivo);
    }
    
    if (filtroNotaActiva) {
      filtrados = filtrados.filter(p => p.Notas.includes(filtroNotaActiva));
    }

    renderizarGrid(filtrados);
  }

  // 5. Inyectar HTML en el grid
  function renderizarGrid(items) {
    gridContainer.innerHTML = ''; // Limpiar grid actual

    if (items.length === 0) {
      gridContainer.innerHTML = '<div style="padding: 4rem 2rem;"><p>No hay cafés que coincidan con esta selección.</p></div>';
      return;
    }

    items.forEach(item => {
      const notasFormat = item.Notas.join(' · ');
      
      const div = document.createElement('div');
      div.className = 'coffee-item border-right';
      div.innerHTML = `
        <span class="origin">${item.Región}</span>
        <h3>${item.Categoría}</h3>
        <p>${notasFormat}</p>
        <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 1rem;">
          ${item.Productor} — ${item.Varietal}
        </p>
      `;
      gridContainer.appendChild(div);
    });
  }
});
