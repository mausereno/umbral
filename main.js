document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. LÓGICA DEL SLIDER DEL HERO
  // ==========================================
  const slides = document.querySelectorAll('.slide');
  
  if (slides.length > 0) { // Validación de seguridad
    let currentSlide = 0;
    slides[0].classList.add('active'); // Iniciar primer slide
    
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000); // Cambia cada 5 segundos
  }

  // ==========================================
  // 2. INTERSECTION OBSERVER (Animación de entrada)
  // ==========================================
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

  // Clase para activar la animación inyectada en el <head>
  const style = document.createElement('style');
  style.innerHTML = `
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ==========================================
  // 3. LÓGICA DE CAFÉS Y SMART CHIPS
  // ==========================================
  const gridContainer = document.getElementById('coffee-grid');
  const chipProcesos = document.getElementById('chip-procesos');

  let productos = [];
  let filtroProcesoActivo = null;

  // Cargar el JSON
  fetch('productos.json')
    .then(response => response.json())
    .then(data => {
      productos = data;
      inicializarFiltros();
      renderizarGrid(productos); // Al no haber errores arriba, esta línea ya se ejecutará
    })
    .catch(error => console.error('Error cargando los cafés:', error));

  // Crear los chips dinámicamente
  function inicializarFiltros() {
    // Obtenemos solo las categorías (procesos) únicos
    const categorias = [...new Set(productos.map(p => p.Categoría))];

    categorias.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = cat;
      // Simplificamos la llamada ya que solo hay un tipo de filtro
      btn.onclick = () => alternarFiltro(cat, btn);
      chipProcesos.appendChild(btn);
    });
  }

  // Lógica para activar/desactivar el filtro de proceso
  function alternarFiltro(valor, boton) {
    if (boton.classList.contains('active')) {
      // Si ya estaba activo, lo apagamos y mostramos todos
      boton.classList.remove('active');
      filtroProcesoActivo = null;
    } else {
      // Apagamos todos los demás y encendemos el clickeado
      Array.from(chipProcesos.children).forEach(btn => btn.classList.remove('active'));
      boton.classList.add('active');
      filtroProcesoActivo = valor;
    }

    aplicarFiltros();
  }

  // Filtrar y re-renderizar
  function aplicarFiltros() {
    let filtrados = productos;

    if (filtroProcesoActivo) {
      filtrados = filtrados.filter(p => p.Categoría === filtroProcesoActivo);
    }

    renderizarGrid(filtrados);
  }

  // Inyectar HTML en el grid
  function renderizarGrid(items) {
    if (!gridContainer) return; 
    
    gridContainer.innerHTML = ''; 

    if (items.length === 0) {
      gridContainer.innerHTML = '<div style="padding: 4rem 2rem;"><p>No hay cafés que coincidan con esta selección.</p></div>';
      return;
    }

    items.forEach(item => {
      
      const div = document.createElement('div');
      div.className = 'coffee-item';
      div.onclick = () => {
        window.location.href = item.onClick;
      };
      
      div.innerHTML = `
        <div class="coffee-img-wrapper">
          <img src="${item.Imagen || 'img/placeholder-cafe.jpg'}" alt="Café de ${item.Localidad}">
        </div>
        <span class="origin">${item.Localidad}, ${item.Región}</span>
        <h3>${item.Categoría}</h3>
        <p>${item.Productor} — ${item.Varietal}</p>
      `;
      gridContainer.appendChild(div);
    });
  }

});
const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        // Alterna las clases 'active'
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Evita que el usuario haga scroll en la página mientras el menú está abierto
        if (mobileMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });