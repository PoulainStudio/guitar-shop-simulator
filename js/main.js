const productList = document.getElementById('product-list');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const itemCount = document.getElementById('item-count');
const cartTotal = document.getElementById('cart-total');
const searchInput = document.getElementById('search-input');
const openCartButton = document.getElementById('open-cart');
const closeCartButton = document.getElementById('close-cart');
const clearCartButton = document.getElementById('clear-cart');
const checkoutButton = document.getElementById('checkout');
const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalBrand = document.getElementById('modal-brand');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const colorOptions = document.getElementById('color-options');
const modalAdd = document.getElementById('modal-add');
const heroImage = document.getElementById('hero-image');
const exploreBtn = document.getElementById('explore-btn');

let products = [];
let cart = [];

const STORAGE_KEY = 'guitar-shop-cart';

const formatCurrency = value => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format(value);

const saveCart = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
const loadCart = () => { const saved = localStorage.getItem(STORAGE_KEY); cart = saved ? JSON.parse(saved) : []; };

const updateCartCounters = () => {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalItems;
  itemCount.textContent = totalItems;
};

const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

const createProductCard = product => `
  <article class="product-card" id="product-${product.id}" data-id="${product.id}">
    <img src="${product.imagen}" alt="Guitarra ${product.nombre}">
    <div class="card-body">
      <div>
        <p class="eyebrow">${product.marca}</p>
        <h3>${product.nombre}</h3>
        <p class="muted">${product.descripcion}</p>
      </div>
      <div class="product-meta">
        <span>${formatCurrency(product.precio)}</span>
        <div class="product-actions">
          <button class="add-button" data-id="${product.id}">Comprar</button>
        </div>
      </div>
    </div>
  </article>
`;

const renderProducts = items => {
  productList.innerHTML = items.map(createProductCard).join('');
  const first = items[0];
  if (first && heroImage) {
    const img = heroImage.querySelector('img');
    if (img) img.src = first.imagen;
  }
};

const renderCart = () => {
  cartItemsContainer.innerHTML = cart.length > 0
    ? cart.map(item => `
        <article class="cart-item">
          <img src="${item.imagen}" alt="${item.nombre}">
          <div class="item-details">
            <h4>${item.nombre}${item.color ? ' — ' + item.color : ''}</h4>
            <p class="muted">${item.marca || ''}${item.type === 'accessory' ? ' • Accesorio' : ''}</p>
            <div class="item-meta">
              <span>${item.quantity} x ${formatCurrency(item.price)}</span>
              <button class="remove-button" data-key="${item.key}">Eliminar</button>
            </div>
            <p>Subtotal: <strong>${formatCurrency(item.price * item.quantity)}</strong></p>
          </div>
        </article>
      `).join('')
    : '<p class="empty-message">No hay productos en el carrito aún.</p>';

  cartTotal.textContent = formatCurrency(calculateTotal());
  updateCartCounters();
};

const openCart = () => {
  cartPanel.classList.add('open');
  cartPanel.setAttribute('aria-hidden', 'false');
  // focus the cart close control for keyboard users
  setTimeout(() => { closeCartButton.focus(); }, 40);
  _cartKeyHandler = function(e) { if (e.key === 'Escape') closeCart(); };
  document.addEventListener('keydown', _cartKeyHandler);
};

const closeCart = () => {
  cartPanel.classList.remove('open');
  cartPanel.setAttribute('aria-hidden', 'true');
  if (_cartKeyHandler) { document.removeEventListener('keydown', _cartKeyHandler); _cartKeyHandler = null; }
};

const findProduct = id => products.find(p => Number(p.id) === Number(id));

const generateKey = (id, color) => `${id}::${color || ''}`;

const addToCart = (product, color) => {
  if (!product) return;
  const key = generateKey(product.id, color || '');
  const exists = cart.find(i => i.key === key);
  if (exists) {
    cart = cart.map(i => i.key === key ? { ...i, quantity: i.quantity + 1 } : i);
  } else {
    const item = {
      key,
      id: product.id,
      nombre: product.nombre,
      marca: product.marca,
      price: product.precio,
      imagen: product.imagen,
      quantity: 1,
      type: 'product',
      color: color || null
    };
    cart = [...cart, item];
  }
  saveCart();
  renderCart();
  Swal.fire({ icon: 'success', title: 'Agregado', text: `${product.nombre} agregado al carrito.`, timer: 1400, showConfirmButton: false, background: '#07020a', color: '#fff' });
};

const addAccessoryToCart = (name, price, image) => {
  const key = `acc::${name}`;
  const exists = cart.find(i => i.key === key);
  if (exists) {
    cart = cart.map(i => i.key === key ? { ...i, quantity: i.quantity + 1 } : i);
  } else {
    cart = [...cart, { key, id: key, nombre: name, marca: '', price: Number(price), imagen: image, quantity: 1, type: 'accessory' }];
  }
  saveCart();
  renderCart();
  Swal.fire({ icon: 'success', title: 'Accesorio agregado', timer: 1200, showConfirmButton: false, background: '#07020a', color: '#fff' });
};

const removeFromCart = key => {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
  Swal.fire({ icon: 'info', title: 'Eliminado', text: `${item.nombre} se ha eliminado.`, timer: 1200, showConfirmButton: false, background: '#07020a', color: '#fff' });
};

const clearCart = () => {
  if (cart.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Carrito vacío', text: 'No hay nada para vaciar.', background: '#07020a', color: '#fff' });
    return;
  }
  cart = [];
  saveCart();
  renderCart();
  Swal.fire({ icon: 'success', title: 'Carrito vaciado', timer: 1200, showConfirmButton: false, background: '#07020a', color: '#fff' });
};

const checkout = () => {
  if (cart.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Sin productos', text: 'Añade al menos un producto para finalizar la compra.', background: '#07020a', color: '#fff' });
    return;
  }
  const total = formatCurrency(calculateTotal());
  cart = [];
  saveCart();
  renderCart();
  Swal.fire({ icon: 'success', title: 'Compra finalizada', html: `<strong>Gracias por tu compra.</strong><br>Total: <strong>${total}</strong>`, confirmButtonText: 'Continuar', background: '#07020a', color: '#fff' });
};

// Modal controls
let currentModalProduct = null;
let selectedColor = null;
let lastFocusedElement = null;
let _modalKeyHandler = null;
let _cartKeyHandler = null;

const openProductModal = product => {
  if (!product) return;
  currentModalProduct = product;
  modalImage.src = product.imagen;
  modalName.textContent = product.nombre;
  modalBrand.textContent = product.marca;
  modalDesc.textContent = product.descripcion_larga || product.descripcion;
  modalPrice.textContent = formatCurrency(product.precio);
  colorOptions.innerHTML = '';
  selectedColor = null;
  (product.colores || []).forEach(col => {
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.dataset.color = col;
    sw.tabIndex = 0;
    const map = { 'Negro':'#0b0b0b','Blanco':'#f7f7f7','Rojo':'#c62828','Azul':'#1976d2','Sunburst':'linear-gradient(90deg,#b35a12,#ffd07a)'};
    if (map[col] && map[col].startsWith('linear')) sw.style.background = map[col]; else sw.style.background = map[col] || '#ddd';
    sw.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
      selectedColor = col;
    });
    sw.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); sw.click(); }
    });
    colorOptions.appendChild(sw);
  });

  // store previous focus and open modal
  lastFocusedElement = document.activeElement;
  productModal.setAttribute('aria-hidden','false');
  // focus close control
  setTimeout(() => { modalClose.focus(); }, 50);

  // trap focus and Escape inside modal
  _modalKeyHandler = function(e) {
    if (e.key === 'Escape') { closeProductModal(); }
    if (e.key === 'Tab') {
      const focusable = productModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', _modalKeyHandler);
};

const closeProductModal = () => {
  productModal.setAttribute('aria-hidden','true');
  currentModalProduct = null;
  selectedColor = null;
  if (_modalKeyHandler) { document.removeEventListener('keydown', _modalKeyHandler); _modalKeyHandler = null; }
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  lastFocusedElement = null;
};

// Event handlers
const handleProductListClick = e => {
  const addBtn = e.target.closest('.add-button');
  if (addBtn) {
    const id = addBtn.dataset.id;
    const product = findProduct(id);
    addToCart(product);
    return;
  }
  const card = e.target.closest('.product-card');
  if (card) {
    const id = card.dataset.id;
    const product = findProduct(id);
    openProductModal(product);
  }
};

const handleCartClick = e => {
  const btn = e.target.closest('.remove-button');
  if (!btn) return;
  const key = btn.dataset.key;
  removeFromCart(key);
};

const handleAccessoryClick = e => {
  const btn = e.target.closest('.add-accessory');
  if (!btn) return;
  const card = btn.closest('.accessory-card');
  const name = card.dataset.name;
  const price = card.dataset.price;
  const image = card.dataset.image;
  addAccessoryToCart(name, price, image);
};

const filterProducts = query => {
  const normalized = query.trim().toLowerCase();
  const filtered = products.filter(product => product.nombre.toLowerCase().includes(normalized) || product.marca.toLowerCase().includes(normalized));
  renderProducts(filtered);
};

const renderFetchError = () => {
  productList.innerHTML = `
    <div class="error-panel">
      <h3>Lo sentimos</h3>
      <p>Lo sentimos, no pudimos cargar el catálogo en este momento.</p>
    </div>
  `;
};

const loadProducts = async () => {
  try {
    const response = await fetch('./data/guitarras.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    products = await response.json();
    renderProducts(products);
    document.querySelectorAll('.product-card').forEach((el, i) => setTimeout(() => el.classList.add('fade-in'), i * 50));
  } catch (err) {
    renderFetchError();
  }
};

const beginnerPrompt = () => {
  Swal.fire({
    title: '¿Buscás una guitarra para empezar?',
    showDenyButton: true,
    confirmButtonText: 'Sí, soy principiante',
    denyButtonText: 'No, ya tengo experiencia',
    background: '#07020a',
    color: '#fff'
  }).then(result => {
    if (result.isConfirmed) {
      const strat = products.find(p => p.nombre.toLowerCase().includes('strat'));
      if (strat) {
        const el = document.getElementById(`product-${strat.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        Swal.fire({ icon: 'info', title: 'Recomendación', text: 'La Stratocaster suele ser una de las mejores opciones para comenzar.', timer: 2800, showConfirmButton: false, background: '#07020a', color: '#fff' });
      }
    }
  });
};

const init = () => {
  loadCart();
  loadProducts();
  renderCart();

  productList.addEventListener('click', handleProductListClick);
  cartItemsContainer.addEventListener('click', handleCartClick);
  document.addEventListener('click', handleAccessoryClick);
  openCartButton.addEventListener('click', openCart);
  closeCartButton.addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);
  checkoutButton.addEventListener('click', checkout);
  searchInput.addEventListener('input', e => filterProducts(e.target.value));
  modalClose.addEventListener('click', closeProductModal);
  modalAdd.addEventListener('click', () => { if (currentModalProduct) addToCart(currentModalProduct, selectedColor); closeProductModal(); });
  exploreBtn && exploreBtn.addEventListener('click', () => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' }));

  setTimeout(beginnerPrompt, 700);
};

document.addEventListener('DOMContentLoaded', init);
