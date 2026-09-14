/* ==========================================================
  PASTELERIA 1000 SABORES — Listado y detalle de productos
   ========================================================== */

function crearTarjetaProducto(p) {
  const article = document.createElement("article");
  article.className = "product-card";
  article.innerHTML = `
    <a class="thumb" href="producto-detalle.html?codigo=${p.codigo}">
      <img src="${p.imagen}" alt="${p.nombre}">
    </a>
    <div class="body">
      <span class="cat">${p.categoria}</span>
      <h3><a href="producto-detalle.html?codigo=${p.codigo}">${p.nombre}</a></h3>
      ${p.stock <= p.stockCritico ? `<span class="stock-alert">¡Últimas ${p.stock} unidades!</span>` : ""}
      <span class="price">${formatoCLP(p.precio)}</span>
      <form data-codigo="${p.codigo}" class="add-to-cart-form">
        <button type="submit" class="btn btn-primary btn-small" ${p.stock === 0 ? "disabled" : ""}>
          ${p.stock === 0 ? "Sin stock" : "Añadir al carrito"}
        </button>
      </form>
    </div>
  `;
  return article;
}

function renderProductos(lista, contenedorId) {
  const contenedor = document.querySelector(contenedorId);
  if (!contenedor) return;
  contenedor.innerHTML = "";
  if (lista.length === 0) {
    contenedor.innerHTML = `<p>No encontramos productos en esta categoría.</p>`;
    return;
  }
  lista.forEach((p) => contenedor.appendChild(crearTarjetaProducto(p)));
  activarBotonesAgregar();
}

function activarBotonesAgregar() {
  document.querySelectorAll(".add-to-cart-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const codigo = form.dataset.codigo;
      const inputCantidad = form.querySelector("input[type=number]");
      const cantidad = inputCantidad ? parseInt(inputCantidad.value, 10) || 1 : 1;
      agregarAlCarrito(codigo, cantidad);

      const boton = form.querySelector("button");
      const textoOriginal = boton.textContent;
      boton.textContent = "¡Agregado!";
      setTimeout(() => (boton.textContent = textoOriginal), 1000);
    });
  });
}

/* ---------- Página: listado de productos ---------- */
function initListadoProductos() {
  const grid = document.querySelector("#grid-productos");
  if (!grid) return;

  renderProductos(PRODUCTOS, "#grid-productos");

  const filtros = document.querySelectorAll(".filters button");
  filtros.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtros.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const categoria = btn.dataset.categoria;
      const filtrados = categoria === "todos" ? PRODUCTOS : PRODUCTOS.filter((p) => p.categoria === categoria);
      renderProductos(filtrados, "#grid-productos");
    });
  });
}

/* ---------- Página: detalle de producto ---------- */
function initDetalleProducto() {
  const contenedor = document.querySelector("#detalle-producto");
  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const producto = PRODUCTOS.find((p) => p.codigo === codigo) || PRODUCTOS[0];

  document.title = `${producto.nombre} — Pastelería 1000 Sabores`;
  contenedor.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <div>
      <p class="breadcrumb"><a href="index.html">Home</a> &gt; <a href="productos.html">${producto.categoria}</a> &gt; ${producto.nombre}</p>
      <h1>${producto.nombre}</h1>
      <p class="price">${formatoCLP(producto.precio)}</p>
      <p>${producto.descripcion}</p>
      ${producto.stock <= producto.stockCritico ? `<p class="stock-alert">¡Quedan solo ${producto.stock} unidades!</p>` : `<p class="hint">Stock disponible: ${producto.stock}</p>`}
      <form class="add-to-cart-form" data-codigo="${producto.codigo}">
        <div class="qty-row">
          <label for="cantidad">Cantidad</label>
          <input type="number" id="cantidad" name="cantidad" value="1" min="1" max="${Math.max(producto.stock, 1)}">
        </div>
        <button type="submit" class="btn btn-primary" ${producto.stock === 0 ? "disabled" : ""}>
          ${producto.stock === 0 ? "Sin stock" : "Añadir al carrito"}
        </button>
      </form>
    </div>
  `;
  activarBotonesAgregar();

  const relacionados = PRODUCTOS.filter((p) => p.categoria === producto.categoria && p.codigo !== producto.codigo).slice(0, 4);
  renderProductos(relacionados, "#grid-relacionados");
}

document.addEventListener("DOMContentLoaded", () => {
  initListadoProductos();
  initDetalleProducto();
});
