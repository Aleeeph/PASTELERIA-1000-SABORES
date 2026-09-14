/* ==========================================================
  PASTELERIA 1000 SABORES — Listado y detalle de blog
   ========================================================== */

function initListadoBlogs() {
  const grid = document.querySelector("#grid-blogs");
  if (!grid) return;
  grid.innerHTML = "";
  BLOGS.forEach((b) => {
    const card = document.createElement("article");
    card.className = "blog-card";
    card.innerHTML = `
      <img src="${b.imagen}" alt="${b.titulo}">
      <div class="body">
        <h3><a href="blog-detalle.html?id=${b.id}">${b.titulo}</a></h3>
        <p>${b.resumen}</p>
        <a class="btn btn-outline btn-small" href="blog-detalle.html?id=${b.id}">Ver caso</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initDetalleBlog() {
  const contenedor = document.querySelector("#detalle-blog");
  if (!contenedor) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 1;
  const blog = BLOGS.find((b) => b.id === id) || BLOGS[0];

  document.title = `${blog.titulo} — Pastelería 1000 Sabores`;
  contenedor.innerHTML = `
    <p class="breadcrumb"><a href="index.html">Home</a> &gt; <a href="blogs.html">Blog</a> &gt; ${blog.titulo}</p>
    <h1>${blog.titulo}</h1>
    <img src="${blog.imagen}" alt="${blog.titulo}">
    <p>${blog.contenido}</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  initListadoBlogs();
  initDetalleBlog();
});
