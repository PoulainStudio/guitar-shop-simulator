# Revolución Musical — Guitar Shop Simulator

Proyecto: simulador de tienda de guitarras creado con HTML, CSS y JavaScript puro. Diseño y marca: Revolución Musical — "La guitarra que va a acompañar tu historia".

## Descripción
Sitio estático que simula una tienda online de guitarras y accesorios. Incluye catálogo cargado desde `data/guitarras.json`, modal de detalle con selección de color, carrito con persistencia en `localStorage`, mensajes visuales mediante SweetAlert2 y un diseño responsive con estética vintage/ochentera (neón y dorado).

## Tecnologías
- HTML5
- CSS3 (variables, grid, flexbox, media queries)
- JavaScript (ES6+)
- SweetAlert2 (CDN)

## Funcionalidades principales
- Carga de productos desde `data/guitarras.json` mediante Fetch API.
- Renderizado dinámico del catálogo y búsqueda en tiempo real.
- Modal de producto con imágenes, descripción larga y selector de colores.
- Carrito: agregar (por color), eliminar, vaciar y finalizar compra.
- Totales calculados automáticamente y guardado en `localStorage` para persistencia.
- Accesorios independientes que se agregan al carrito.
- Mensajes y flujos para usuarios principiantes usando SweetAlert2.
- Diseño responsive y micro-interacciones (hover, focus, transiciones).

## Estructura de carpetas
- `index.html` — página principal.
- `css/style.css` — estilos principales.
- `js/main.js` — lógica de la app (fetch, render, carrito, modal).
- `data/guitarras.json` — datos de productos (no inyectados desde JS).
- `assets/` — imágenes, iconos y recursos (por ejemplo `assets/img/placeholder-guitar.jpg`).

## Instrucciones de instalación y ejecución local
1. Clonar o descargar el repositorio en tu equipo.
2. Abrir la carpeta del proyecto.
3. Abrir `index.html` en el navegador (doble clic o `File > Open`).

Opcional: servir con un servidor local (recomendado para evitar restricciones CORS en algunos navegadores):

Windows PowerShell:

```powershell
# usando Python 3
python -m http.server 8000
# luego abrir http://localhost:8000
```

VS Code (Live Server):

- Instalar la extensión Live Server y seleccionar "Open with Live Server" en `index.html`.

## Notas y próximos pasos sugeridos
- Reemplazar `assets/img/placeholder-guitar.jpg` por una imagen local de mayor resolución para el hero.
- Mejorar accesibilidad con focus trap en el modal y roles ARIA detallados.
- Añadir pruebas visuales y comprobación cross-browser.

---

Si querés, puedo:
- crear o añadir la imagen `assets/img/placeholder-guitar.jpg`,
- implementar focus trap y cierre con `Esc` en el modal,
- generar una versión optimizada para impresión o PDF.

Decime qué preferís que haga a continuación.