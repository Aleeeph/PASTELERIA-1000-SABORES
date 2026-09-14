/* ==========================================================
  PASTELERIA 1000 SABORES — Carrito de compras
   ========================================================== */

function renderCarrito() {
  const lista = document.querySelector("#lista-carrito");
  if (!lista) return;

  const carrito = obtenerCarrito();
  const vacio = document.querySelector("#carrito-vacio");
  const resumen = document.querySelector("#cart-summary");

  if (carrito.length === 0) {
    lista.innerHTML = "";
    if (vacio) vacio.style.display = "block";
    if (resumen) resumen.style.display = "none";
    return;
  }

  if (vacio) vacio.style.display = "none";
  if (resumen) resumen.style.display = "block";

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    const producto = PRODUCTOS.find((p) => p.codigo === item.codigo);
    if (!producto) return;
    const subtotal = producto.precio * item.cantidad;
    total += subtotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div>
        <h3>${producto.nombre}</h3>
        <p class="hint">${formatoCLP(producto.precio)} c/u</p>
        <button type="button" class="remove-link" data-codigo="${producto.codigo}">Quitar</button>
      </div>
      <div class="qty-controls">
        <button type="button" class="btn-menos" data-codigo="${producto.codigo}">−</button>
        <span>${item.cantidad}</span>
        <button type="button" class="btn-mas" data-codigo="${producto.codigo}" ${item.cantidad >= producto.stock ? "disabled" : ""}>+</button>
      </div>
      <strong>${formatoCLP(subtotal)}</strong>
    `;
    lista.appendChild(row);
  });

  const totalEl = document.querySelector("#carrito-total");
  if (totalEl) totalEl.textContent = formatoCLP(total);

  lista.querySelectorAll(".btn-mas").forEach((btn) =>
    btn.addEventListener("click", () => cambiarCantidad(btn.dataset.codigo, 1))
  );
  lista.querySelectorAll(".btn-menos").forEach((btn) =>
    btn.addEventListener("click", () => cambiarCantidad(btn.dataset.codigo, -1))
  );
  lista.querySelectorAll(".remove-link").forEach((btn) =>
    btn.addEventListener("click", () => quitarDelCarrito(btn.dataset.codigo))
  );
}

function cambiarCantidad(codigo, delta) {
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.codigo === codigo);
  const producto = PRODUCTOS.find((p) => p.codigo === codigo);
  if (!item || !producto) return;

  item.cantidad += delta;
  if (item.cantidad > producto.stock) item.cantidad = producto.stock;
  if (item.cantidad <= 0) {
    quitarDelCarrito(codigo);
    return;
  }
  guardarCarrito(carrito);
  renderCarrito();
}

function quitarDelCarrito(codigo) {
  const carrito = obtenerCarrito().filter((i) => i.codigo !== codigo);
  guardarCarrito(carrito);
  renderCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();

  const btnPagar = document.querySelector("#btn-pagar");
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      const msg = document.querySelector("#checkout-msg");
      if (msg) {
        msg.className = "form-msg show success";
        msg.textContent = "¡Compra simulada con éxito! (el pago real se integrará en una etapa posterior).";
      }
      guardarCarrito([]);
      renderCarrito();
    });
  }
});
