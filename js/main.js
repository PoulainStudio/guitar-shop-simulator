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

let products = [];
let cart = [];

const STORAGE_KEY = 'guitar-shop-cart';

const formatCurrency = value => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format(value);

const saveCart = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

const loadCart = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  cart = saved ? JSON.parse(saved) : [];
};

const updateCartCounters = () => {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalItems;
  itemCount.textContent = totalItems;
};

const calculateTotal = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

const renderProducts = items => {
  productList.innerHTML = items.map(product => `
    <article class="product-card">
      <img src="${product.imagen}" alt="Guitarra ${product.nombre}">
      <div class="card-body">
        <div>
          <p class="eyebrow">${product.marca}</p>
          <h3>${product.nombre}</h3>
          <p>${product.descripcion}</p>
        </div>
        <div class="product-meta">
          <span>${formatCurrency(product.precio)}</span>
          <button class="add-button" data-id="${product.id}">Agregar al carrito</button>
        </div>
      </div>
    </article>
  `).join('');
};

const renderCart = () => {
  cartItemsContainer.innerHTML = cart.length > 0
    ? cart.map(item => `
        <article class="cart-item">
          <img src="${item.imagen}" alt="${item.nombre}">
          <div class="item-details">
            <h4>${item.nombre}</h4>
            <p>${item.marca}</p>
            <div class="item-meta">
              <span>${item.quantity} x ${formatCurrency(item.price)}</span>
              <button class="remove-button" data-id="${item.id}">Eliminar</button>
            </div>
            <p>Subtotal: <strong>${formatCurrency(item.price * item.quantity)}</strong></p>
          </div>
        </article>
      `).join('')
    : '<p class="empty-message">No hay productos en el carrito aún.</p>';

  cartTotal.textContent = formatCurrency(calculateTotal());
  updateCartCounters();
};

const openCart = () => cartPanel.classList.add('open');
const closeCart = () => cartPanel.classList.remove('open');

const getProductById = id => products.find(product => product.id === id);

const addToCart = id => {
  const product = getProductById(id);
  if (!product) return;

  const exists = cart.find(item => item.id === id);
  if (exists) {
    cart = cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
  } else {
    cart = [...cart, { ...product, quantity: 1 }];
  }

  saveCart();
  renderCart();
  Swal.fire({
    icon: 'success',
    title: 'Agregado al carrito',
    text: `${product.nombre} se ha agregado correctamente.`,
    timer: 1700,
    showConfirmButton: false,
    background: '#0b1220',
    color: '#f4f7ff'
  });
};

const removeFromCart = id => {
  const deleted = cart.find(item => item.id === id);
  if (!deleted) return;

  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  Swal.fire({
    icon: 'info',
    title: 'Producto eliminado',
    text: `${deleted.nombre} se ha quitado del carrito.`,
    timer: 1500,
    showConfirmButton: false,
    background: '#0b1220',
    color: '#f4f7ff'
  });
};

const clearCart = () => {
  if (cart.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'No hay nada para vaciar.',
      background: '#0b1220',
      color: '#f4f7ff'
    });
    return;
  }

  cart = [];
  saveCart();
  renderCart();
  Swal.fire({
    icon: 'success',
    title: 'Carrito vaciado',
    text: 'Tu carrito ahora está vacío.',
    timer: 1500,
    showConfirmButton: false,
    background: '#0b1220',
    color: '#f4f7ff'
  });
};

const checkout = () => {
  if (cart.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin productos',
      text: 'Añade al menos un producto para finalizar la compra.',
      background: '#0b1220',
      color: '#f4f7ff'
    });
    return;
  }

  const total = formatCurrency(calculateTotal());
  cart = [];
  saveCart();
  renderCart();

  Swal.fire({
    icon: 'success',
    title: 'Compra finalizada',
    html: `<strong>Gracias por tu compra.</strong><br>Total: <strong>${total}</strong>`,
    confirmButtonText: 'Continuar',
    background: '#0b1220',
    color: '#f4f7ff'
  });
};

const handleProductClick = event => {
  const button = event.target.closest('.add-button');
  if (!button) return;
  const id = Number(button.dataset.id);
  addToCart(id);
};

const handleCartClick = event => {
  const button = event.target.closest('.remove-button');
  if (!button) return;
  const id = Number(button.dataset.id);
  removeFromCart(id);
};

const filterProducts = query => {
  const normalized = query.trim().toLowerCase();
  const filtered = products.filter(product =>
    product.nombre.toLowerCase().includes(normalized) ||
    product.marca.toLowerCase().includes(normalized)
  );
  renderProducts(filtered);
};

const loadProducts = async () => {
  try {
    const response = await fetch('data/guitarras.json');
    products = await response.json();
    renderProducts(products);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de carga',
      text: 'No fue posible cargar los productos. Intenta de nuevo más tarde.',
      background: '#0b1220',
      color: '#f4f7ff'
    });
  }
};

const init = () => {
  loadCart();
  loadProducts();
  renderCart();

  productList.addEventListener('click', handleProductClick);
  cartItemsContainer.addEventListener('click', handleCartClick);
  openCartButton.addEventListener('click', openCart);
  closeCartButton.addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);
  checkoutButton.addEventListener('click', checkout);
  searchInput.addEventListener('input', event => filterProducts(event.target.value));
};

document.addEventListener('DOMContentLoaded', init);
