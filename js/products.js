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

  renderProducts() {
    const productGrid = document.getElementById('productGrid') || document.getElementById('productList');
    if (!productGrid) return;

    if (this.filteredProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="no-products">
          <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-400 text-lg">No products found matching your criteria.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = '';
    
    this.filteredProducts.forEach((product, index) => {
      const productCard = this.createProductCard(product, index);
      productGrid.appendChild(productCard);
    });

    // Add scroll animations
    this.addScrollAnimations();
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
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
        ${product.featured ? '<div class="featured-badge">Featured</div>' : ''}
        <div class="product-overlay">
          <button class="quick-view-btn" onclick="openQuickView(${product.id})">
            <i class="fas fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-colors">
          ${product.colors.map(color => `
            <span class="color-swatch" style="background-color: ${color}" title="Color option"></span>
          `).join('')}
        </div>
        <div class="product-price-stock">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <span class="stock-status ${stockStatus}">${stockText}</span>
        </div>
        <button class="add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}" 
                onclick="openProductModal(${product.id})" 
                ${product.stock === 0 ? 'disabled' : ''}>
          <i class="fas fa-shopping-cart"></i>
          ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    `;

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
          <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p class="text-red-500 text-lg">${message}</p>
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
        <button class="modal-close" onclick="closeProductModal()">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-body">
          <div class="modal-image">
            <img id="modalProductImage" src="" alt="">
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

    // Populate modal content
    document.getElementById('modalProductImage').src = product.image;
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
      btn.classList.toggle('selected', btn.getAttribute('data-color') === color);
    });

    // Update image based on selected color
    const colorImage = this.currentProduct.colorImages?.[color];
    document.getElementById('modalProductImage').src = colorImage || this.currentProduct.image;

  }

  addToCart() {
    if (this.currentProduct && this.selectedSize && this.selectedColor) {
      cartManager.addToCart(this.currentProduct, this.selectedSize, this.selectedColor);
      this.close();
    }
  }
}

// Initialize managers
let productManager;
let productModal;

document.addEventListener('DOMContentLoaded', () => {
  productManager = new ProductManager();
  productModal = new ProductModal();
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

window.addToCartFromModal = () => {
  productModal.addToCart();
};

window.openQuickView = (productId) => {
  productModal.open(productId);
};