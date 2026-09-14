/* ==========================================================
  PASTELERIA 1000 SABORES — Validaciones de formularios en JavaScript
   Reglas de negocio definidas en las instrucciones de la EV1.
   ========================================================== */

/** Muestra un error específico bajo el campo indicado. */
function marcarError(row, mensaje) {
  row.classList.add("invalid");
  row.classList.remove("valid");
  const errorEl = row.querySelector(".field-error");
  if (errorEl) errorEl.textContent = mensaje;
}

function marcarValido(row) {
  row.classList.remove("invalid");
  row.classList.add("valid");
}

function correoValido(correo) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patron.test(correo)) return false;
  const dominio = correo.split("@")[1]?.toLowerCase();
  return CORREOS_PERMITIDOS.some((permitido) => dominio === permitido);
}

/* ---------- Validación: Iniciar sesión ---------- */
function initValidacionLogin() {
  const form = document.querySelector("#form-login");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    const correoRow = form.querySelector("#row-correo");
    const correo = form.querySelector("#login-correo").value.trim();
    if (!correo) {
      marcarError(correoRow, "El correo es requerido.");
      valido = false;
    } else if (correo.length > 100) {
      marcarError(correoRow, "Máximo 100 caracteres.");
      valido = false;
    } else if (!correoValido(correo)) {
      marcarError(correoRow, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      valido = false;
    } else {
      marcarValido(correoRow);
    }

    const passRow = form.querySelector("#row-password");
    const password = form.querySelector("#login-password").value;
    if (!password) {
      marcarError(passRow, "La contraseña es requerida.");
      valido = false;
    } else if (password.length < 4 || password.length > 10) {
      marcarError(passRow, "Debe tener entre 4 y 10 caracteres.");
      valido = false;
    } else {
      marcarValido(passRow);
    }

    const msg = form.querySelector(".form-msg");
    if (valido) {
      msg.textContent = "Inicio de sesión correcto. Redirigiendo a la tienda…";
      msg.className = "form-msg show success";
      setTimeout(() => (window.location.href = "index.html"), 1200);
    } else {
      msg.textContent = "Revisa los campos marcados en rojo.";
      msg.className = "form-msg show error";
    }
  });
}

/* ---------- Validación: Registro de usuario ---------- */
function validarRun(run) {
  const limpio = run.replace(/[.\-]/g, "").toUpperCase();
  if (limpio.length < 7 || limpio.length > 9) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  let dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

function initValidacionRegistro() {
  const form = document.querySelector("#form-registro");
  if (!form) return;

  // Región -> comuna dinámico
  const selectRegion = form.querySelector("#registro-region");
  const selectComuna = form.querySelector("#registro-comuna");
  if (selectRegion && selectComuna) {
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
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    const campos = [
      {
        id: "registro-run",
        rowId: "row-run",
        validar: (v) => v && validarRun(v),
        mensaje: "RUN inválido. Ingresa sin puntos ni guion (ej: 19011022K).",
        requerido: "El RUN es requerido.",
      },
      {
        id: "registro-nombre",
        rowId: "row-nombre",
        validar: (v) => v.length <= 50,
        mensaje: "Máximo 50 caracteres.",
        requerido: "El nombre es requerido.",
      },
      {
        id: "registro-apellidos",
        rowId: "row-apellidos",
        validar: (v) => v.length <= 100,
        mensaje: "Máximo 100 caracteres.",
        requerido: "Los apellidos son requeridos.",
      },
      {
        id: "registro-correo",
        rowId: "row-correo-reg",
        validar: (v) => v.length <= 100 && correoValido(v),
        mensaje: "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100).",
        requerido: "El correo es requerido.",
      },
      {
        id: "registro-direccion",
        rowId: "row-direccion",
        validar: (v) => v.length <= 300,
        mensaje: "Máximo 300 caracteres.",
        requerido: "La dirección es requerida.",
      },
    ];

    campos.forEach(({ id, rowId, validar, mensaje, requerido }) => {
      const input = form.querySelector("#" + id);
      const row = form.querySelector("#" + rowId);
      const valor = input.value.trim();
      if (!valor) {
        marcarError(row, requerido);
        valido = false;
      } else if (!validar(valor)) {
        marcarError(row, mensaje);
        valido = false;
      } else {
        marcarValido(row);
      }
    });

    const edadRow = form.querySelector("#row-edad");
    const edad = Number(form.querySelector("#registro-edad").value);
    if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
      marcarError(edadRow, "Ingresa una edad válida entre 1 y 120 años.");
      valido = false;
    } else {
      marcarValido(edadRow);
    }

    const codigoRow = form.querySelector("#row-codigo-promocional");
    const codigoPromocional = form.querySelector("#registro-codigo-promocional").value.trim().toUpperCase();
    if (codigoPromocional && codigoPromocional !== "FELICES50") {
      marcarError(codigoRow, "El código de aniversario no es válido.");
      valido = false;
    } else {
      marcarValido(codigoRow);
    }

    // Contraseña + confirmación (regla adicional del equipo)
    const passRow = form.querySelector("#row-password-reg");
    const pass = form.querySelector("#registro-password").value;
    const confirmRow = form.querySelector("#row-confirm-password");
    const confirmPass = form.querySelector("#registro-confirm-password").value;
    if (pass.length < 4 || pass.length > 10) {
      marcarError(passRow, "La contraseña debe tener entre 4 y 10 caracteres.");
      valido = false;
    } else {
      marcarValido(passRow);
    }
    if (confirmPass !== pass || !confirmPass) {
      marcarError(confirmRow, "Las contraseñas no coinciden.");
      valido = false;
    } else {
      marcarValido(confirmRow);
    }

    // Región / comuna
    const regionRow = form.querySelector("#row-region");
    if (!selectRegion.value) {
      marcarError(regionRow, "Selecciona una región.");
      valido = false;
    } else {
      marcarValido(regionRow);
    }
    const comunaRow = form.querySelector("#row-comuna");
    if (!selectComuna.value) {
      marcarError(comunaRow, "Selecciona una comuna.");
      valido = false;
    } else {
      marcarValido(comunaRow);
    }

    const msg = form.querySelector(".form-msg");
    if (valido) {
      const beneficios = [];
      if (edad > 50) beneficios.push("50% de descuento por edad");
      if (codigoPromocional === "FELICES50") beneficios.push("10% de descuento permanente");
      msg.textContent = beneficios.length
        ? `¡Cuenta creada! Beneficios activados: ${beneficios.join(" y ")}.`
        : "¡Cuenta creada con éxito! Ya puedes iniciar sesión.";
      msg.className = "form-msg show success";
      form.reset();
    } else {
      msg.textContent = "Revisa los campos marcados en rojo.";
      msg.className = "form-msg show error";
    }
  });
}

/* ---------- Validación: Contacto ---------- */
function initValidacionContacto() {
  const form = document.querySelector("#form-contacto");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    const nombreRow = form.querySelector("#row-nombre-contacto");
    const nombre = form.querySelector("#contacto-nombre").value.trim();
    if (!nombre) {
      marcarError(nombreRow, "El nombre es requerido.");
      valido = false;
    } else if (nombre.length > 100) {
      marcarError(nombreRow, "Máximo 100 caracteres.");
      valido = false;
    } else {
      marcarValido(nombreRow);
    }

    const correoRow = form.querySelector("#row-correo-contacto");
    const correo = form.querySelector("#contacto-correo").value.trim();
    if (correo && (correo.length > 100 || !correoValido(correo))) {
      marcarError(correoRow, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      valido = false;
    } else {
      marcarValido(correoRow);
    }

    const comentarioRow = form.querySelector("#row-comentario");
    const comentario = form.querySelector("#contacto-comentario").value.trim();
    if (!comentario) {
      marcarError(comentarioRow, "Cuéntanos en qué te ayudamos.");
      valido = false;
    } else if (comentario.length > 500) {
      marcarError(comentarioRow, "Máximo 500 caracteres.");
      valido = false;
    } else {
      marcarValido(comentarioRow);
    }

    const msg = form.querySelector(".form-msg");
    if (valido) {
      msg.textContent = "¡Gracias! Recibimos tu mensaje y te responderemos pronto.";
      msg.className = "form-msg show success";
      form.reset();
    } else {
      msg.textContent = "Revisa los campos marcados en rojo.";
      msg.className = "form-msg show error";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initValidacionLogin();
  initValidacionRegistro();
  initValidacionContacto();
});
