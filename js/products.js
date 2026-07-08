class ProductManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.currentSort = 'featured';
    this.init();
  }

  async init() {
    this.showLoading();
    await this.loadProducts();
    this.bindEvents();
    this.renderProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch('../data/products.json');
      const data = await response.json();
      this.products = data.products;
      this.filteredProducts = [...this.products];
    } catch (error) {
      console.error('Error loading products:', error);
      this.showError('Failed to load products. Please refresh the page.');
    }
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value.toLowerCase();
        this.filterProducts();
      });
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.filterProducts();
      });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.sortProducts();
      });
    }

    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        this.currentFilter = category;
        this.updateCategoryButtons(category);
        this.filterProducts();
      });
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.currentFilter === 'all' || product.category === this.currentFilter;
      const matchesSearch = product.title.toLowerCase().includes(this.currentSearch) ||
                           product.description.toLowerCase().includes(this.currentSearch);
      return matchesCategory && matchesSearch;
    });

    this.sortProducts();
  }

  sortProducts() {
    switch (this.currentSort) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        this.filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    this.renderProducts();
  }

  showLoading() {
    const productGrid = document.getElementById('productGrid') || document.getElementById('productList');
    if (!productGrid) return;
    productGrid.innerHTML = Array.from({ length: 6 }).map(() => `
      <div class="product-card skeleton-card" aria-hidden="true">
        <div class="product-image-container skeleton-shimmer"></div>
        <div class="product-info">
          <div class="skeleton-line skeleton-shimmer" style="width:70%;height:1rem;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width:95%;height:0.8rem;margin-top:0.6rem;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width:40%;height:1.3rem;margin-top:1rem;"></div>
        </div>
      </div>
    `).join('');
  }

  renderProducts() {
    const productGrid = document.getElementById('productGrid') || document.getElementById('productList');
    if (!productGrid) return;

    this.updateResultCount();

    if (this.filteredProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="no-products">
          <i class="fas fa-magnifying-glass-minus"></i>
          <p class="empty-title">No gear matches that search</p>
          <p>Try a different keyword or clear the filter.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = '';

    this.filteredProducts.forEach((product, index) => {
      const productCard = this.createProductCard(product, index);
      productGrid.appendChild(productCard);
    });

    this.addScrollAnimations();
  }

  updateResultCount() {
    const el = document.getElementById('resultCount');
    if (!el) return;
    const n = this.filteredProducts.length;
    el.textContent = `${n} ${n === 1 ? 'item' : 'items'}`;
  }

  categoryIcon(category) {
    const key = String(category || '').toLowerCase();
    if (key === 'accessories') return 'fa-gem';
    return 'fa-shirt';
  }

  createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const stockStatus = product.stock > 0 ?
      (product.stock <= 5 ? 'low-stock' : 'in-stock') : 'out-of-stock';

    const stockText = product.stock > 0 ?
      (product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock') : 'Out of Stock';

    card.innerHTML = `
      <div class="product-image-container" onclick="openProductModal(${product.id})" role="button" tabindex="0" aria-label="View ${product.title}">
        <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy"
             onerror="this.parentElement.classList.add('img-fallback'); this.remove();">
        <div class="image-fallback-icon"><i class="fas ${this.categoryIcon(product.category)}"></i><span>Photo coming soon</span></div>
        ${product.featured ? '<div class="featured-badge">Featured</div>' : ''}
        <div class="view-badge" aria-hidden="true"><i class="fas fa-eye"></i></div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-colors">
          ${product.colors.map((color, i) => `
            <button type="button" class="color-swatch ${i === 0 ? 'active' : ''}" style="background-color: ${color}"
                    data-color="${color}" aria-label="View in this color" aria-pressed="${i === 0}"></button>
          `).join('')}
        </div>
        <div class="product-price-stock">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <span class="stock-status ${stockStatus}">${stockText}</span>
        </div>
        <button class="add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}"
                onclick="event.stopPropagation(); openProductModal(${product.id})"
                ${product.stock === 0 ? 'disabled' : ''}>
          <i class="fas ${product.stock === 0 ? 'fa-ban' : 'fa-sliders'}"></i>
          ${product.stock === 0 ? 'Out of Stock' : 'Select Options'}
        </button>
      </div>
    `;

    // Swatches switch the card photo (and stop the click from also opening the modal)
    card.querySelectorAll('.color-swatch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const img = card.querySelector('.product-image');
        const color = btn.dataset.color;
        if (img) img.src = product.colorImages?.[color] || product.image;
        card.querySelectorAll('.color-swatch').forEach(s => {
          s.classList.toggle('active', s === btn);
          s.setAttribute('aria-pressed', s === btn ? 'true' : 'false');
        });
      });
    });

    return card;
  }

  updateCategoryButtons(activeCategory) {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === activeCategory);
    });
  }

  addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => {
      observer.observe(card);
    });
  }

  showError(message) {
    const productGrid = document.getElementById('productGrid') || document.getElementById('productList');
    if (productGrid) {
      productGrid.innerHTML = `
        <div class="error-message">
          <i class="fas fa-triangle-exclamation"></i>
          <p class="empty-title">${message}</p>
        </div>
      `;
    }
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }
}

// Product Modal functionality
class ProductModal {
  constructor() {
    this.modal = null;
    this.currentProduct = null;
    this.selectedSize = null;
    this.selectedColor = null;
    this.createModal();
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'product-modal';
    this.modal.innerHTML = `
      <div class="modal-backdrop" onclick="closeProductModal()"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="closeProductModal()" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-body">
          <div class="modal-image">
            <img id="modalProductImage" src="" alt="" onerror="this.closest('.modal-image').classList.add('img-fallback'); this.remove();">
            <div class="image-fallback-icon"><i class="fas fa-shirt"></i><span>Photo coming soon</span></div>
          </div>
          <div class="modal-info">
            <h2 id="modalProductTitle"></h2>
            <p id="modalProductDescription"></p>
            <div class="modal-price">
              <span id="modalProductPrice"></span>
            </div>
            <div class="modal-options">
              <div class="size-selector">
                <label>Size:</label>
                <div class="size-options" id="modalSizeOptions"></div>
              </div>
              <div class="color-selector">
                <label>Color:</label>
                <div class="color-options" id="modalColorOptions"></div>
              </div>
            </div>
            <button class="modal-add-to-cart" onclick="addToCartFromModal()">
              <i class="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);
  }

  open(productId) {
    const product = productManager.getProductById(productId);
    if (!product) return;

    this.currentProduct = product;
    this.selectedSize = product.sizes[0];
    this.selectedColor = product.colors[0];

    // Reset the fallback state from any previous product before repopulating
    const imageWrap = this.modal.querySelector('.modal-image');
    imageWrap.classList.remove('img-fallback');
    imageWrap.innerHTML = `
      <img id="modalProductImage" src="${product.image}" alt="${product.title}" onerror="this.closest('.modal-image').classList.add('img-fallback'); this.remove();">
      <div class="image-fallback-icon"><i class="fas ${productManager.categoryIcon(product.category)}"></i><span>Photo coming soon</span></div>
    `;

    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;

    // Populate size options
    const sizeOptions = document.getElementById('modalSizeOptions');
    sizeOptions.innerHTML = product.sizes.map(size => `
      <button class="size-option ${size === this.selectedSize ? 'selected' : ''}"
              onclick="selectSize('${size}')">${size}</button>
    `).join('');

    // Populate color options
    const colorOptions = document.getElementById('modalColorOptions');
    colorOptions.innerHTML = product.colors.map(color => `
      <button class="color-option ${color === this.selectedColor ? 'selected' : ''}"
              style="background-color: ${color}"
              data-color="${color}"
              aria-label="Select color"
              aria-pressed="${color === this.selectedColor}"
              onclick="selectColor('${color}')"></button>
    `).join('');

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  selectSize(size) {
    this.selectedSize = size;
    document.querySelectorAll('.size-option').forEach(btn => {
      btn.classList.toggle('selected', btn.textContent === size);
    });
  }

  selectColor(color) {
    this.selectedColor = color;

    document.querySelectorAll('.color-option').forEach(btn => {
      const isSelected = btn.getAttribute('data-color') === color;
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    // Update image based on selected color
    const colorImage = this.currentProduct.colorImages?.[color];
    const imageWrap = this.modal.querySelector('.modal-image');
    const img = document.getElementById('modalProductImage');
    imageWrap.classList.remove('img-fallback');
    if (img) img.src = colorImage || this.currentProduct.image;
  }
}

// Initialize managers — var so window.productManager / window.productModal resolve correctly
var productManager;
var productModal;

document.addEventListener('DOMContentLoaded', () => {
  productManager = new ProductManager();
  productModal   = new ProductModal();
});

// Global functions
window.openProductModal = (productId) => {
  productModal.open(productId);
};

window.closeProductModal = () => {
  productModal.close();
};

window.selectSize = (size) => {
  productModal.selectSize(size);
};

window.selectColor = (color) => {
  productModal.selectColor(color);
};

// NOTE: the modal's "Add to Cart" button calls window.addToCartFromModal.
// This file has no cart of its own — the host page must define it
// (see Merch.html, which wires it to its own cart/localStorage logic).
