/* ==========================================================
  PASTELERIA 1000 SABORES — Datos base del proyecto
  ========================================================== */

const PRODUCTOS = [
  { codigo: "PMS-001", nombre: "Torta Selva de Chocolate", descripcion: "Bizcocho húmedo de chocolate, crema y ganache artesanal. Ideal para celebraciones familiares.", precio: 24990, stock: 12, stockCritico: 3, categoria: "tortas", imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80" },
  { codigo: "PMS-002", nombre: "Torta Tres Leches", descripcion: "Receta tradicional con bizcocho suave, tres leches y crema batida de vainilla.", precio: 22990, stock: 15, stockCritico: 3, categoria: "tortas", imagen: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80" },
  { codigo: "PMS-003", nombre: "Torta Frutilla y Crema", descripcion: "Bizcocho de vainilla relleno con crema pastelera y frutillas frescas de temporada.", precio: 26990, stock: 8, stockCritico: 2, categoria: "tortas", imagen: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80" },
  { codigo: "PMS-004", nombre: "Cheesecake de Frutos Rojos", descripcion: "Base crocante, cheesecake horneado y cobertura de frutos rojos seleccionados.", precio: 19990, stock: 10, stockCritico: 3, categoria: "pasteles", imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80" },
  { codigo: "PMS-005", nombre: "Caja de 6 Cupcakes", descripcion: "Seis cupcakes de vainilla y chocolate con decoraciones de aniversario personalizables.", precio: 12990, stock: 20, stockCritico: 4, categoria: "pasteles", imagen: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&q=80" },
  { codigo: "PMS-006", nombre: "Tarta de Limón", descripcion: "Masa sablé, crema de limón y merengue tostado. Fresca, equilibrada y hecha a mano.", precio: 17990, stock: 9, stockCritico: 2, categoria: "tartas", imagen: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80" },
  { codigo: "PMS-007", nombre: "Brownie Familiar", descripcion: "Brownie de chocolate 60% cacao con nueces tostadas, perfecto para compartir.", precio: 9990, stock: 25, stockCritico: 5, categoria: "dulces", imagen: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=80" },
  { codigo: "PMS-008", nombre: "Torta 50 Aniversario", descripcion: "Edición especial de chocolate y manjar, decorada con los colores de Pastelería 1000 Sabores.", precio: 32990, stock: 5, stockCritico: 2, categoria: "celebraciones", imagen: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80" }
];

const BLOGS = [
  {
    id: 1,
    titulo: "50 años endulzando Chile",
    resumen: "La historia de Pastelería 1000 Sabores y su participación en un récord Guinness.",
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80",
    contenido: "En 1995, Pastelería 1000 Sabores colaboró en la creación de la torta más grande del mundo, un hito que se convirtió en parte de la historia de la repostería chilena. Hoy celebramos cinco décadas de recetas, familias y momentos compartidos con ingredientes de calidad y creatividad en cada decoración."
  },
  {
    id: 2,
    titulo: "Secretos para una torta inolvidable",
    resumen: "Consejos de nuestros pasteleros para elegir, conservar y servir tu torta.",
    imagen: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&q=80",
    contenido: "Una torta memorable empieza con ingredientes frescos y termina con una buena conservación. Mantenla refrigerada, retírala 20 minutos antes de servir y elige un tamaño que permita repetir. Para personalizarla, agrega un mensaje especial y coordina tu fecha de entrega con anticipación."
  }
];

const REGIONES = [
  {
    nombre: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Ñuñoa", "Maipú", "Puente Alto"]
  },
  {
    nombre: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"]
  },
  {
    nombre: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"]
  },
  {
    nombre: "Región de la Araucanía",
    comunas: ["Temuco", "Villarrica", "Angol", "Pucón"]
  }
];

const CORREOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
