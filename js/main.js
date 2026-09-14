/* ==========================================================
  PASTELERIA 1000 SABORES — Lógica común de la tienda
   ========================================================== */

// Abre/cierra el menú de navegación en pantallas pequeñas
document.addEventListener("DOMContentLoaded", () => {
  const localInfo = document.createElement("aside");
  localInfo.className = "local-info";
  localInfo.innerHTML = `
    <span>Padre Alonso de Ovalle 1586, 8330196 Santiago, Región Metropolitana</span>
  `;
  document.body.appendChild(localInfo);

  const toggle = document.querySelector(".nav-toggle");
  const navWrap = document.querySelector(".nav-wrap");
  if (toggle && navWrap) {
    toggle.addEventListener("click", () => navWrap.classList.toggle("open"));
  }

  // Año automático en el footer
  const yearSpan = document.querySelector("#anio-actual");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  actualizarContadorCarrito();
});

/* ---------- Carrito: helpers de localStorage ---------- */

const CARRITO_KEY = "pasteleria_1000_sabores_carrito";

function obtenerCarrito() {
  const data = localStorage.getItem(CARRITO_KEY) || localStorage.getItem("cultivo_carrito");
  return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(codigo, cantidad) {
  const producto = PRODUCTOS.find((p) => p.codigo === codigo);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.codigo === codigo);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ codigo, cantidad });
  }
  guardarCarrito(carrito);
}

function actualizarContadorCarrito() {
  const contador = document.querySelector("#contador-carrito");
  if (!contador) return;
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = totalItems;
}

function formatoCLP(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}
