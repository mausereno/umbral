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
