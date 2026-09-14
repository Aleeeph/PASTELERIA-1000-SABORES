/* ==========================================================
  PASTELERIA 1000 SABORES — Panel administrador
   Mantenedor de productos y usuarios (en memoria, sin backend)
   ========================================================== */

// Copia local editable de productos, para simular el mantenedor sin backend real.
const ADMIN_PRODUCTOS_KEY = "pasteleria_admin_productos";

function obtenerProductosAdmin() {
  const data = localStorage.getItem(ADMIN_PRODUCTOS_KEY);
  return data ? JSON.parse(data) : JSON.parse(JSON.stringify(PRODUCTOS));
}

function guardarProductosAdmin(lista) {
  localStorage.setItem(ADMIN_PRODUCTOS_KEY, JSON.stringify(lista));
}

const ADMIN_USUARIOS_KEY = "pasteleria_admin_usuarios";

const USUARIOS_DEMO = [
  { run: "191122334", nombre: "Javiera", apellidos: "Soto Muñoz", correo: "javiera@1000sabores.cl", tipo: "Administrador", region: "Región Metropolitana de Santiago", comuna: "Providencia", direccion: "Av. Providencia 1234" },
  { run: "182233445", nombre: "Matías", apellidos: "Reyes Poblete", correo: "matias@1000sabores.cl", tipo: "Vendedor", region: "Región del Biobío", comuna: "Concepción", direccion: "Calle O'Higgins 55" }
];

function obtenerUsuariosAdmin() {
  const data = localStorage.getItem(ADMIN_USUARIOS_KEY);
  return data ? JSON.parse(data) : JSON.parse(JSON.stringify(USUARIOS_DEMO));
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem(ADMIN_USUARIOS_KEY, JSON.stringify(lista));
}

/* ---------- Listado de productos (admin) ---------- */
function initListadoProductosAdmin() {
  const tbody = document.querySelector("#tabla-productos tbody");
  if (!tbody) return;

  const productos = obtenerProductosAdmin();
  tbody.innerHTML = "";
  productos.forEach((p) => {
    const tr = document.createElement("tr");
    if (p.stock <= p.stockCritico) tr.classList.add("critical-row");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${formatoCLP(p.precio)}</td>
      <td>${p.stock}${p.stock <= p.stockCritico ? ' <span class="badge">Stock crítico</span>' : ""}</td>
      <td class="actions-cell">
        <a class="btn btn-outline btn-small" href="producto-form.html?codigo=${p.codigo}">Editar</a>
        <button class="btn btn-danger btn-small" data-codigo="${p.codigo}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-codigo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Eliminar este producto?")) return;
      const lista = obtenerProductosAdmin().filter((p) => p.codigo !== btn.dataset.codigo);
      guardarProductosAdmin(lista);
      initListadoProductosAdmin();
    });
  });
}

/* ---------- Formulario producto (nuevo / editar) ---------- */
function initFormularioProducto() {
  const form = document.querySelector("#form-producto");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const productos = obtenerProductosAdmin();
  const existente = codigo ? productos.find((p) => p.codigo === codigo) : null;

  document.querySelector("#titulo-form-producto").textContent = existente ? "Editar producto" : "Nuevo producto";

  if (existente) {
    form.querySelector("#prod-codigo").value = existente.codigo;
    form.querySelector("#prod-codigo").disabled = true;
    form.querySelector("#prod-nombre").value = existente.nombre;
    form.querySelector("#prod-descripcion").value = existente.descripcion;
    form.querySelector("#prod-precio").value = existente.precio;
    form.querySelector("#prod-stock").value = existente.stock;
    form.querySelector("#prod-stock-critico").value = existente.stockCritico;
    form.querySelector("#prod-categoria").value = existente.categoria;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    const codigoRow = form.querySelector("#row-prod-codigo");
    const codigoVal = form.querySelector("#prod-codigo").value.trim();
    if (!existente) {
      if (!codigoVal || codigoVal.length < 3) {
        marcarError(codigoRow, "Mínimo 3 caracteres.");
        valido = false;
      } else if (productos.some((p) => p.codigo === codigoVal)) {
        marcarError(codigoRow, "Ya existe un producto con ese código.");
        valido = false;
      } else {
        marcarValido(codigoRow);
      }
    }

    const nombreRow = form.querySelector("#row-prod-nombre");
    const nombre = form.querySelector("#prod-nombre").value.trim();
    if (!nombre) {
      marcarError(nombreRow, "El nombre es requerido.");
      valido = false;
    } else if (nombre.length > 100) {
      marcarError(nombreRow, "Máximo 100 caracteres.");
      valido = false;
    } else {
      marcarValido(nombreRow);
    }

    const descRow = form.querySelector("#row-prod-descripcion");
    const descripcion = form.querySelector("#prod-descripcion").value.trim();
    if (descripcion.length > 500) {
      marcarError(descRow, "Máximo 500 caracteres.");
      valido = false;
    } else {
      marcarValido(descRow);
    }

    const precioRow = form.querySelector("#row-prod-precio");
    const precio = parseFloat(form.querySelector("#prod-precio").value);
    if (isNaN(precio) || precio < 0) {
      marcarError(precioRow, "El precio debe ser 0 o mayor (0 = producto gratuito).");
      valido = false;
    } else {
      marcarValido(precioRow);
    }

    const stockRow = form.querySelector("#row-prod-stock");
    const stockVal = form.querySelector("#prod-stock").value;
    if (!/^\d+$/.test(stockVal) || parseInt(stockVal, 10) < 0) {
      marcarError(stockRow, "El stock debe ser un número entero, 0 o mayor.");
      valido = false;
    } else {
      marcarValido(stockRow);
    }

    const categoriaRow = form.querySelector("#row-prod-categoria");
    const categoria = form.querySelector("#prod-categoria").value;
    if (!categoria) {
      marcarError(categoriaRow, "Selecciona una categoría.");
      valido = false;
    } else {
      marcarValido(categoriaRow);
    }

    const msg = form.querySelector(".form-msg");
    if (!valido) {
      msg.textContent = "Revisa los campos marcados en rojo.";
      msg.className = "form-msg show error";
      return;
    }

    const stockCriticoVal = form.querySelector("#prod-stock-critico").value;
    const nuevoProducto = {
      codigo: existente ? existente.codigo : codigoVal,
      nombre,
      descripcion,
      precio,
      stock: parseInt(stockVal, 10),
      stockCritico: stockCriticoVal ? parseInt(stockCriticoVal, 10) : 0,
      categoria,
      imagen: existente ? existente.imagen : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"
    };

    let lista = obtenerProductosAdmin();
    if (existente) {
      lista = lista.map((p) => (p.codigo === existente.codigo ? nuevoProducto : p));
    } else {
      lista.push(nuevoProducto);
    }
    guardarProductosAdmin(lista);

    msg.textContent = "Producto guardado correctamente.";
    msg.className = "form-msg show success";
    setTimeout(() => (window.location.href = "productos.html"), 900);
  });
}

/* ---------- Listado de usuarios (admin) ---------- */
function initListadoUsuariosAdmin() {
  const tbody = document.querySelector("#tabla-usuarios tbody");
  if (!tbody) return;

  const usuarios = obtenerUsuariosAdmin();
  tbody.innerHTML = "";
  usuarios.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.run}</td>
      <td>${u.nombre} ${u.apellidos}</td>
      <td>${u.correo}</td>
      <td><span class="badge">${u.tipo}</span></td>
      <td class="actions-cell">
        <a class="btn btn-outline btn-small" href="usuario-form.html?run=${u.run}">Editar</a>
        <button class="btn btn-danger btn-small" data-run="${u.run}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-run]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Eliminar este usuario?")) return;
      const lista = obtenerUsuariosAdmin().filter((u) => u.run !== btn.dataset.run);
      guardarUsuariosAdmin(lista);
      initListadoUsuariosAdmin();
    });
  });
}

/* ---------- Formulario usuario (nuevo / editar) ---------- */
function initFormularioUsuario() {
  const form = document.querySelector("#form-usuario");
  if (!form) return;

  const selectRegion = form.querySelector("#usr-region");
  const selectComuna = form.querySelector("#usr-comuna");
  REGIONES.forEach((r, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = r.nombre;
    selectRegion.appendChild(opt);
  });
  selectRegion.addEventListener("change", () => {
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
    const region = REGIONES[selectRegion.value];
    if (!region) return;
    region.comunas.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      selectComuna.appendChild(opt);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const run = params.get("run");
  const usuarios = obtenerUsuariosAdmin();
  const existente = run ? usuarios.find((u) => u.run === run) : null;

  document.querySelector("#titulo-form-usuario").textContent = existente ? "Editar usuario" : "Nuevo usuario";

  if (existente) {
    form.querySelector("#usr-run").value = existente.run;
    form.querySelector("#usr-run").disabled = true;
    form.querySelector("#usr-nombre").value = existente.nombre;
    form.querySelector("#usr-apellidos").value = existente.apellidos;
    form.querySelector("#usr-correo").value = existente.correo;
    form.querySelector("#usr-tipo").value = existente.tipo;
    form.querySelector("#usr-direccion").value = existente.direccion;
    const regionIdx = REGIONES.findIndex((r) => r.nombre === existente.region);
    if (regionIdx > -1) {
      selectRegion.value = regionIdx;
      selectRegion.dispatchEvent(new Event("change"));
      selectComuna.value = existente.comuna;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    const runRow = form.querySelector("#row-usr-run");
    const runVal = form.querySelector("#usr-run").value.trim();
    if (!existente) {
      if (!runVal || !validarRun(runVal)) {
        marcarError(runRow, "RUN inválido. Sin puntos ni guion (ej: 19011022K).");
        valido = false;
      } else {
        marcarValido(runRow);
      }
    }

    const nombreRow = form.querySelector("#row-usr-nombre");
    const nombre = form.querySelector("#usr-nombre").value.trim();
    if (!nombre || nombre.length > 50) {
      marcarError(nombreRow, !nombre ? "El nombre es requerido." : "Máximo 50 caracteres.");
      valido = false;
    } else {
      marcarValido(nombreRow);
    }

    const apellidosRow = form.querySelector("#row-usr-apellidos");
    const apellidos = form.querySelector("#usr-apellidos").value.trim();
    if (!apellidos || apellidos.length > 100) {
      marcarError(apellidosRow, !apellidos ? "Los apellidos son requeridos." : "Máximo 100 caracteres.");
      valido = false;
    } else {
      marcarValido(apellidosRow);
    }

    const correoRow = form.querySelector("#row-usr-correo");
    const correo = form.querySelector("#usr-correo").value.trim();
    if (!correo || correo.length > 100 || !correoValido(correo)) {
      marcarError(correoRow, "Correo requerido, @duoc.cl/@profesor.duoc.cl/@gmail.com, máx. 100.");
      valido = false;
    } else {
      marcarValido(correoRow);
    }

    const direccionRow = form.querySelector("#row-usr-direccion");
    const direccion = form.querySelector("#usr-direccion").value.trim();
    if (!direccion || direccion.length > 300) {
      marcarError(direccionRow, !direccion ? "La dirección es requerida." : "Máximo 300 caracteres.");
      valido = false;
    } else {
      marcarValido(direccionRow);
    }

    const msg = form.querySelector(".form-msg");
    if (!valido) {
      msg.textContent = "Revisa los campos marcados en rojo.";
      msg.className = "form-msg show error";
      return;
    }

    const nuevoUsuario = {
      run: existente ? existente.run : runVal.replace(/[.\-]/g, "").toUpperCase(),
      nombre,
      apellidos,
      correo,
      tipo: form.querySelector("#usr-tipo").value,
      region: REGIONES[selectRegion.value]?.nombre || "",
      comuna: selectComuna.value,
      direccion
    };

    let lista = obtenerUsuariosAdmin();
    if (existente) {
      lista = lista.map((u) => (u.run === existente.run ? nuevoUsuario : u));
    } else {
      lista.push(nuevoUsuario);
    }
    guardarUsuariosAdmin(lista);

    msg.textContent = "Usuario guardado correctamente.";
    msg.className = "form-msg show success";
    setTimeout(() => (window.location.href = "usuarios.html"), 900);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initListadoProductosAdmin();
  initFormularioProducto();
  initListadoUsuariosAdmin();
  initFormularioUsuario();
});
