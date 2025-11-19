// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Local Storage Functions (saving only, no auto-loading)
function saveCartToStorage() {
    const cartData = {
        items: shoppingCart.getItems().map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        })),
        total: shoppingCart.total,
        size: shoppingCart.size
    };
    localStorage.setItem('fioraCart', JSON.stringify(cartData));
}

function saveWishlistToStorage() {
    localStorage.setItem('fioraWishlist', JSON.stringify(wishlist));
}

// Data Structures Implementation

// Product Class
class Product {
    constructor(id, name, price, category, image, description, additionalImages = [], rating = 0, reviews = []) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.description = description;
        this.additionalImages = additionalImages;
        this.rating = rating;
        this.reviews = reviews;
    }
}

// Cart Item Class (for Linked List Node)
class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
        this.next = null;
    }
}

// Shopping Cart Class (Linked List Implementation)
class ShoppingCart {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.total = 0;
    }

    // Add item to cart (insert at end)
    addItem(product, quantity) {
        const MAX_ITEMS = 99;
        
        // Check if adding would exceed limit
        const currentItem = this.getItems().find(item => item.product.id === product.id);
        const currentQty = currentItem ? currentItem.quantity : 0;
        const newQty = currentQty + quantity;
        
        if (newQty > MAX_ITEMS) {
            throw new Error(`Maximum ${MAX_ITEMS} items allowed per product`);
        }
        
        const newItem = new CartItem(product, quantity);
        
        if (this.head === null) {
            this.head = newItem;
            this.tail = newItem;
        } else {
            this.tail.next = newItem;
            this.tail = newItem;
        }
        
        this.size++;
        this.calculateTotal();
        return newItem;
    }

    // Remove item from cart by product ID
    removeItem(productId) {
        if (this.head === null) return null;
        
        let removedItem = null;
        
        // If removing the head
        if (this.head.product.id === productId) {
            removedItem = this.head;
            this.head = this.head.next;
            if (this.head === null) this.tail = null;
            this.size--;
            this.calculateTotal();
            return removedItem;
        }
        
        // Search for the item to remove
        let current = this.head;
        while (current.next !== null) {
            if (current.next.product.id === productId) {
                removedItem = current.next;
                current.next = current.next.next;
                
                // If we removed the tail, update tail
                if (current.next === null) {
                    this.tail = current;
                }
                
                this.size--;
                this.calculateTotal();
                return removedItem;
            }
            current = current.next;
        }
        
        return null; // Item not found
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const MAX_ITEMS = 99;
        
        if (newQuantity > MAX_ITEMS) {
            throw new Error(`Maximum ${MAX_ITEMS} items allowed per product`);
        }
        
        let current = this.head;
        while (current !== null) {
            if (current.product.id === productId) {
                const oldQuantity = current.quantity;
                current.quantity = newQuantity;
                this.calculateTotal();
                return { product: current.product, oldQuantity, newQuantity };
            }
            current = current.next;
        }
        return null;
    }

    // Calculate total price
    calculateTotal() {
        this.total = 0;
        let current = this.head;
        while (current !== null) {
            this.total += current.product.price * current.quantity;
            current = current.next;
        }
        return this.total;
    }

    // Get all items as array (for display)
    getItems() {
        const items = [];
        let current = this.head;
        while (current !== null) {
            items.push(current);
            current = current.next;
        }
        return items;
    }

    // Clear cart
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.total = 0;
    }
}

// Action History Class (Stack Implementation)
class ActionHistory {
    constructor() {
        this.items = [];
    }

    // Push action to stack
    push(action) {
        this.items.push(action);
    }

    // Pop action from stack
    pop() {
        if (this.items.length === 0) return null;
        return this.items.pop();
    }

    // Check if stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get stack size
    size() {
        return this.items.length;
    }
}

// Order History Class (Array Implementation)
class OrderHistory {
    constructor() {
        this.orders = [];
    }

    // Add order to history
    addOrder(cart, total, date = new Date()) {
        this.orders.push({
            items: cart.getItems().map(item => ({
                product: item.product,
                quantity: item.quantity
            })),
            total: total,
            date: date
        });
    }

    // Get all orders
    getOrders() {
        return this.orders;
    }
}

// Sorting Algorithms Implementation
class SortingAlgorithms {
    // Quick Sort Implementation
    static quickSort(arr, compareFn, left = 0, right = arr.length - 1) {
        if (left < right) {
            const pivotIndex = this.partition(arr, compareFn, left, right);
            this.quickSort(arr, compareFn, left, pivotIndex - 1);
            this.quickSort(arr, compareFn, pivotIndex + 1, right);
        }
        return arr;
    }

    static partition(arr, compareFn, left, right) {
        const pivot = arr[right];
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (compareFn(arr[j], pivot) <= 0) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        return i + 1;
    }

    // Merge Sort Implementation
    static mergeSort(arr, compareFn) {
        if (arr.length <= 1) {
            return arr;
        }

        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), compareFn);
        const right = this.mergeSort(arr.slice(mid), compareFn);

        return this.merge(left, right, compareFn);
    }

    static merge(left, right, compareFn) {
        const result = [];
        let i = 0;
        let j = 0;

        while (i < left.length && j < right.length) {
            if (compareFn(left[i], right[j]) <= 0) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }

        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    // Comparison functions for different sorting criteria
    static compareByPriceAsc(a, b) {
        return a.price - b.price;
    }

    static compareByPriceDesc(a, b) {
        return b.price - a.price;
    }

    static compareByName(a, b) {
        return a.name.localeCompare(b.name);
    }

    static compareByCategory(a, b) {
        return a.category.localeCompare(b.category);
    }
}

// Product Catalog (Array Implementation)
const productCatalog = [
    // Best Sellers
    new Product(1, "Candy Pink", 9999.00, "best-sellers", "pics/b1.webp", 
        "A vibrant pink arrangement perfect for celebrations. This stunning bouquet features a mix of premium pink roses, peonies, and carnations, carefully arranged to create a breathtaking display of color and elegance.",
        ["pics/b1.webp", "pics/b2.webp", "pics/b3.webp"]),
    
    new Product(2, "Bright but Light", 2850.00, "best-sellers", "pics/b2.webp", 
        "A cheerful mix of bright flowers to light up any room. This arrangement combines sunflowers, daisies, and yellow roses to create a sunny, uplifting bouquet.",
        ["pics/b2.webp", "pics/b1.webp", "pics/b3.webp"]),
    
    new Product(3, "Berry Cheesecake", 6880.00, "best-sellers", "pics/b3.webp", 
        "Rich tones of berry and cream in an elegant display. This luxurious arrangement features deep burgundy roses, purple lisianthus, and white hydrangeas.",
        ["pics/b3.webp", "pics/b1.webp", "pics/b2.webp"]),
    
    new Product(4, "Dream Land", 3990.00, "best-sellers", "pics/b4.webp", 
        "Soft pastel blooms that evoke a dreamy atmosphere. Features lavender, pale pink roses, and white hydrangeas for a delicate and romantic arrangement.",
        ["pics/b4.webp", "pics/b1.webp", "pics/b2.webp"]),
    
    new Product(5, "Pinkish Belle", 5390.00, "best-sellers", "pics/b5.webp", 
        "Delicate pink flowers arranged with timeless elegance. A beautiful combination of pink peonies, roses, and carnations.",
        ["pics/b5.webp", "pics/b1.webp", "pics/b2.webp"]),

    new Product(6, "Normandiana Wreath", 6500.00, "best-sellers", "pics/b6.jpg", 
        "Normandiana Wreath in Pink and Gold is sure to bring a touch of elegance and sophistication to your space with this timelessly beautiful Normandiana Wreath! Perfectly crafted to bring festivity this Christmas season!",
        ["pics/b5.webp", "pics/b1.webp", "pics/b2.webp"]),

    // Fresh Flowers
    new Product(7, "Blooms Blush", 15999.00, "fresh", "pics/f1.jpg", 
        "A luxurious bouquet of premium fresh blooms featuring garden roses, ranunculus, and eucalyptus. Each stem is hand-selected for perfection.",
        ["pics/f1.jpg", "pics/f2.jpg", "pics/f3.jpg"]),
    
    new Product(8, "Blissful Roses", 6670.00, "fresh", "pics/f2.jpg", 
        "Classic roses arranged to perfection. This timeless bouquet features two dozen premium red roses, symbolizing deep love and affection.",
        ["pics/f2.jpg", "pics/f1.jpg", "pics/f3.jpg"]),
    
    new Product(9, "Rosette", 3490.00, "fresh", "pics/ff3.webp", 
        "A charming arrangement of roses and complementary flowers. Features pink and white roses with baby's breath for a classic look.",
        ["pics/ff3.webp", "pics/f1.jpg", "pics/f2.jpg"]),
    
    new Product(10, "Garden Delight", 4290.00, "fresh", "pics/Garden delight .jpeg", 
        "A beautiful mix of garden fresh flowers including lilies, chrysanthemums, and seasonal greens. Perfect for bringing a touch of nature indoors.",
        ["pics/f4.jpg", "pics/T2.jpg", "pics/G2.jpg"]),
    
    new Product(11, "White Elegance", 5590.00, "fresh", "pics/White elegance .jpg", 
        "Pure white flowers including lilies, roses, and orchids arranged for a sophisticated and clean look. Ideal for weddings and formal events.",
        ["pics/W1.jpeg", "pics/W2.jpeg", "pics/W1.jpeg"]),
    
    new Product(12, "Tropical Bliss", 3890.00, "fresh", "pics/Tropicalbliss.jpg", 
        "Exotic tropical flowers featuring birds of paradise, anthuriums, and tropical greens. Brings a vacation vibe to any space.",
        ["pics/F3.jpeg", "pics/T2.jpg", "pics/T1.jpeg"]),

    new Product(13, "Pastel Mixed", 4290.00, "fresh", "pics/T2.jpg", 
    " A symphony of pastels, a harmony of blooms with gentle gestures thats speaks volume",
        ["pics/f4.jpg", "pics/W2copy.jpeg", "pics/T2.jpg"]),
    
    new Product(14, "Vintage Peach Cream", 5590.00, "fresh", "pics/W1.jpeg", 
        " Where timeless beauty meets modern elegance. Love and light with every bloom.",
        ["pics/f5.webp", "pics/f6.webp", "pics/f1.jpg"]),
    
    new Product(15, "Golden Sunshine", 3890.00, "fresh", "pics/T1.jpeg", 
        "A radiant reminder of all things bright and beautiful.",
        ["pics/f6.webp", "pics/f4.jpg", "pics/ff3.webp"]),

    // Synthetic Flowers
    new Product(16, "Eterna", 349.00, "synthetic", "pics/s1.jpg", 
        "Lifelike synthetic flowers that last forever. These beautifully crafted roses maintain their vibrant color and delicate appearance year after year.",
        ["pics/s1.jpg", "pics/s2.jpg", "pics/s3.jpg"]),
    
    new Product(17, "Silken", 299.00, "synthetic", "pics/ff2.jpg", 
        "Silk flowers with remarkable realism. Our silk arrangements capture the delicate beauty of real flowers with incredible attention to detail.",
        ["pics/ff2.jpg", "pics/s1.jpg", "pics/s2.jpg"]),
    
    new Product(18, "Velvessa", 349.00, "synthetic", "pics/s2.jpg", 
        "Velvety textures that mimic real petals. These synthetic flowers have a soft, realistic feel that closely resembles fresh blooms.",
        ["pics/s2.jpg", "pics/s1.jpg", "pics/ff2.jpg"]),
    
    new Product(19, "Classic Roses", 399.00, "synthetic", "pics/s3.jpg", 
        "Timeless synthetic roses that never wilt. Available in various colors, these roses maintain their beauty forever with zero maintenance.",
        ["pics/s3.jpg", "pics/s4.jpg", "pics/s5.jpg"]),
    
    new Product(20, "Orchid Elegance", 449.00, "synthetic", "pics/s4.jpg", 
        "Lifelike synthetic orchids that capture the delicate beauty of real orchids. Perfect for office decor or home accents.",
        ["pics/s4.jpg", "pics/s3.jpg", "pics/s5.jpg"]),
    
    new Product(21, "Mixed Bloom", 499.00, "synthetic", "pics/s5.jpg", 
        "A beautiful arrangement of mixed synthetic flowers including peonies, roses, and hydrangeas. Looks incredibly realistic.",
        ["pics/s5.jpg", "pics/s3.jpg", "pics/s4.jpg"]),

    new Product(22, "Classic Roses", 399.00, "synthetic", "pics/s3.jpg", 
        "Timeless synthetic roses that never wilt. Available in various colors, these roses maintain their beauty forever with zero maintenance.",
        ["pics/s3.jpg", "pics/s4.jpg", "pics/s5.jpg"]),
    
    new Product(23, "Orchid Elegance", 449.00, "synthetic", "pics/s4.jpg", 
        "Lifelike synthetic orchids that capture the delicate beauty of real orchids. Perfect for office decor or home accents.",
        ["pics/s4.jpg", "pics/s3.jpg", "pics/s5.jpg"]),
    
    new Product(24, "Mixed Bloom", 499.00, "synthetic", "pics/s5.jpg", 
        "A beautiful arrangement of mixed synthetic flowers including peonies, roses, and hydrangeas. Looks incredibly realistic.",
        ["pics/s5.jpg", "pics/s3.jpg", "pics/s4.jpg"]),
    
    // Seasonal Flowers
    new Product(25, "Spring Tulips", 1999.00, "seasonal", "pics/spring1.webp", 
        "Fresh spring tulips in vibrant colors. Celebrate the arrival of spring with this cheerful bouquet of mixed tulips in shades of pink, yellow, and purple.",
        ["pics/spring1.webp", "pics/spring2.jpg", "pics/spring3.jpg"]),
    
    new Product(26, "Summer Sunflowers", 2499.00, "seasonal", "pics/summer1.jpg", 
        "Bright sunflowers to capture summer joy. These vibrant flowers bring the warmth and happiness of summer into any space.",
        ["pics/summer1.jpg", "pics/spring1.webp", "pics/fall.jpg"]),
    
    new Product(27, "Autumn Harvest", 2899.00, "seasonal", "pics/fall.jpg", 
        "Warm autumn colors featuring chrysanthemums, dahlias, and seasonal foliage. Perfect for fall celebrations and Thanksgiving.",
        ["pics/fall.jpg", "pics/spring1.webp", "pics/summer1.jpg"])
];

// Global Variables
const shoppingCart = new ShoppingCart();
const actionHistory = new ActionHistory();
const orderHistory = new OrderHistory();
let wishlist = [];
let currentCategory = 'all';
let currentProductModal = null;

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.getElementById('close-cart');
const cartModal = document.getElementById('cart-modal');
const wishlistIcon = document.getElementById('wishlist-icon');
const closeWishlist = document.getElementById('close-wishlist');
const wishlistModal = document.getElementById('wishlist-modal');
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const wishlistItems = document.getElementById('wishlist-items');
const checkoutBtn = document.getElementById('checkout-btn');
const undoBtn = document.getElementById('undo-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const productContainer = document.getElementById('product-container');
const freshContainer = document.getElementById('fresh-products');
const syntheticContainer = document.getElementById('synthetic-products');
const navLinks = document.querySelectorAll('.nav-menu li a');
const sortSelect = document.getElementById('sort-select');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavClose = document.getElementById('mobile-nav-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu li a');

// Product Modal Elements
const productMainImage = document.getElementById('product-main-image');
const productThumbnails = document.getElementById('product-thumbnails');
const productModalName = document.getElementById('product-modal-name');
const productModalCategory = document.getElementById('product-modal-category');
const productModalPrice = document.getElementById('product-modal-price');
const productModalDescription = document.getElementById('product-modal-description');
const modalMinus = document.getElementById('modal-minus');
const modalPlus = document.getElementById('modal-plus');
const modalQuantity = document.getElementById('modal-quantity');
const modalAddToCart = document.getElementById('modal-add-to-cart');
const modalWishlistBtn = document.getElementById('modal-wishlist-btn');

// Checkout Modal Elements
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const cancelCheckout = document.getElementById('cancel-checkout');
const checkoutForm = document.getElementById('checkout-form');
const submitOrderBtn = document.getElementById('submit-order');

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
function init() {
    console.log('Initializing application...');
    console.log('Cart data from localStorage:', localStorage.getItem('fioraCart'));
    console.log('Wishlist data from localStorage:', localStorage.getItem('fioraWishlist'));
    renderAllProducts();
    setupEventListeners();
    setupWishlistEventListeners();
    updateCartUI();
    updateWishlistUI();
    initCheckout();
    initGallery();
    initEnhancedHero();
}

// Render all products to their respective sections
function renderAllProducts() {
    renderBestSellers();
    renderFreshFlowers();
    renderSyntheticFlowers();
}

// Render best sellers products
function renderBestSellers() {
    if (!productContainer) return;
    
    let productsToShow = productCatalog.filter(product => product.category === 'best-sellers');
    productsToShow = sortProducts(productsToShow, sortSelect.value);
    
    productContainer.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-badge">Bestseller</div>
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description.substring(0, 80)}...</div>
                <div class="product-price">₱${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${product.id}" aria-label="Decrease quantity">-</button>
                        <span class="quantity" data-id="${product.id}">1</span>
                        <button class="quantity-btn plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                    </div>
                    <div class="action-buttons">
                        <button class="add-to-cart" data-id="${product.id}" aria-label="Add to cart">Add to Cart</button>
                        <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render fresh flowers products
function renderFreshFlowers() {
    if (!freshContainer) return;
    
    const freshProducts = productCatalog.filter(product => product.category === 'fresh');
    
    freshContainer.innerHTML = freshProducts.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description.substring(0, 80)}...</div>
                <div class="product-price">₱${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${product.id}" aria-label="Decrease quantity">-</button>
                        <span class="quantity" data-id="${product.id}">1</span>
                        <button class="quantity-btn plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                    </div>
                    <div class="action-buttons">
                        <button class="add-to-cart" data-id="${product.id}" aria-label="Add to cart">Add to Cart</button>
                        <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render synthetic flowers products
function renderSyntheticFlowers() {
    if (!syntheticContainer) return;
    
    const syntheticProducts = productCatalog.filter(product => product.category === 'synthetic');
    
    syntheticContainer.innerHTML = syntheticProducts.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description.substring(0, 80)}...</div>
                <div class="product-price">₱${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${product.id}" aria-label="Decrease quantity">-</button>
                        <span class="quantity" data-id="${product.id}">1</span>
                        <button class="quantity-btn plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                    </div>
                    <div class="action-buttons">
                        <button class="add-to-cart" data-id="${product.id}" aria-label="Add to cart">Add to Cart</button>
                        <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Sort products using custom sorting algorithms
function sortProducts(products, sortBy) {
    const productsCopy = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return SortingAlgorithms.quickSort(productsCopy, SortingAlgorithms.compareByPriceAsc);
        case 'price-high':
            return SortingAlgorithms.quickSort(productsCopy, SortingAlgorithms.compareByPriceDesc);
        case 'name':
            return SortingAlgorithms.mergeSort(productsCopy, SortingAlgorithms.compareByName);
        case 'category':
            return SortingAlgorithms.mergeSort(productsCopy, SortingAlgorithms.compareByCategory);
        default:
            return productsCopy;
    }
}

// Render products based on current category
function renderProducts() {
    if (currentCategory === 'all') {
        renderBestSellers();
    } else {
        // For other categories, you can implement filtering
        const filteredProducts = productCatalog.filter(product => 
            product.category === currentCategory
        );
        // Implementation depends on your specific needs
        console.log(`Rendering ${currentCategory} products:`, filteredProducts.length);
    }
}

function setupEventListeners() {
    // Cart toggle - FIXED
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    // Wishlist toggle - FIXED
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', toggleWishlistModal);
    }
    if (closeWishlist) {
        closeWishlist.addEventListener('click', toggleWishlistModal);
    }
    
    // Product modal - FIXED
    if (closeProductModal) {
        closeProductModal.addEventListener('click', toggleProductModal);
    }
    
    // Checkout modal - FIXED
    if (closeCheckout) {
        closeCheckout.addEventListener('click', toggleCheckoutModal);
    }
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', toggleCheckoutModal);
    }
    
    // Mobile navigation
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileNav);
    }
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', toggleMobileNav);
    }
    
    // Mobile nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Close mobile nav
            toggleMobileNav();
            
            // Scroll to section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Overlay - FIXED
    if (overlay) {
        overlay.addEventListener('click', function() {
            toggleCart();
            toggleWishlistModal();
            toggleProductModal();
            toggleCheckoutModal();
            toggleMobileNav();
        });
    }

    // Checkout form submission - FIXED
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Navigation filtering
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href').substring(1);
            
            if (['best-sellers', 'fresh', 'synthetic', 'seasonal'].includes(targetId)) {
                currentCategory = targetId === 'best-sellers' ? 'all' : targetId;
                renderProducts();
            }
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            renderProducts();
        });
    }

    // Product interactions
    document.addEventListener('click', function(e) {
        // Add to cart button
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }

        // Quantity buttons
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const isPlus = e.target.classList.contains('plus');
            updateProductQuantity(productId, isPlus);
        }

        // Wishlist buttons
        if (e.target.closest('.wishlist-btn')) {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            const productId = parseInt(wishlistBtn.getAttribute('data-id'));
            toggleWishlist(productId, wishlistBtn);
        }

        // Product card click for modal
        if (e.target.closest('.product-card')) {
            const productCard = e.target.closest('.product-card');
            if (!e.target.closest('.product-actions')) {
                const productId = parseInt(productCard.getAttribute('data-id'));
                openProductModal(productId);
            }
        }
    });

    // Cart interactions
    document.addEventListener('click', function(e) {
        // Remove item from cart
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const productId = parseInt(button.getAttribute('data-id'));
            removeFromCart(productId);
        }

        // Cart quantity buttons
        if (e.target.classList.contains('cart-quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            updateCartQuantity(productId, isIncrease);
        }
    });

    // Wishlist interactions
    if (wishlistItems) {
        wishlistItems.addEventListener('click', function(e) {
            if (e.target.classList.contains('move-to-cart')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                moveToCart(productId);
            }

            if (e.target.classList.contains('remove-wishlist')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                removeFromWishlist(productId);
            }
        });
    }

    // Product modal interactions
    if (modalMinus) {
        modalMinus.addEventListener('click', function() {
            let quantity = parseInt(modalQuantity.textContent);
            if (quantity > 1) {
                modalQuantity.textContent = quantity - 1;
            }
        });
    }

    if (modalPlus) {
        modalPlus.addEventListener('click', function() {
            let quantity = parseInt(modalQuantity.textContent);
            modalQuantity.textContent = quantity + 1;
        });
    }

    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            if (currentProductModal) {
                const quantity = parseInt(modalQuantity.textContent);
                addToCart(currentProductModal.id, quantity);
                toggleProductModal();
            }
        });
    }

    if (modalWishlistBtn) {
        modalWishlistBtn.addEventListener('click', function() {
            if (currentProductModal) {
                toggleWishlist(currentProductModal.id, modalWishlistBtn);
                const productCardBtn = document.querySelector(`.wishlist-btn[data-id="${currentProductModal.id}"]`);
                if (productCardBtn) {
                    productCardBtn.classList.toggle('active', wishlist.includes(currentProductModal.id));
                }
            }
        });
    }

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Undo button
    if (undoBtn) {
        undoBtn.addEventListener('click', undoLastAction);
    }

    // Search functionality with debounce
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
}

// Toggle mobile navigation
function toggleMobileNav() {
    if (!mobileNav) return;
    
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

// Toggle cart modal - FIXED
function toggleCart() {
    if (!cartModal) {
        console.error('Cart modal not found!');
        return;
    }
    
    cartModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
    
    if (cartModal.classList.contains('active')) {
        // Close other modals
        if (wishlistModal) wishlistModal.classList.remove('active');
        if (productModal) productModal.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    }
}

// Toggle wishlist modal - FIXED
function toggleWishlistModal() {
    if (!wishlistModal) {
        console.error('Wishlist modal not found!');
        return;
    }
    
    wishlistModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = wishlistModal.classList.contains('active') ? 'hidden' : '';
    
    if (wishlistModal.classList.contains('active')) {
        // Close other modals
        if (cartModal) cartModal.classList.remove('active');
        if (productModal) productModal.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    }
}

// Toggle product modal - FIXED
function toggleProductModal() {
    if (!productModal) {
        console.error('Product modal not found!');
        return;
    }
    
    productModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = productModal.classList.contains('active') ? 'hidden' : '';
    
    if (productModal.classList.contains('active')) {
        // Close other modals
        if (cartModal) cartModal.classList.remove('active');
        if (wishlistModal) wishlistModal.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    } else {
        currentProductModal = null;
    }
}

// Toggle checkout modal - FIXED
function toggleCheckoutModal() {
    if (!checkoutModal) {
        console.error('Checkout modal not found!');
        return;
    }
    
    checkoutModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = checkoutModal.classList.contains('active') ? 'hidden' : '';
    
    if (checkoutModal.classList.contains('active')) {
        populateOrderSummary();
    } else {
        resetCheckoutForm();
    }
}

// Populate order summary in checkout
function populateOrderSummary() {
    const orderSummary = document.getElementById('checkout-order-summary');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!orderSummary || !checkoutTotal) {
        console.error('Order summary elements not found!');
        return;
    }
    
    const items = shoppingCart.getItems();
    orderSummary.innerHTML = items.map(item => `
        <div class="order-item">
            <span>${item.product.name} (${item.quantity})</span>
            <span>₱${(item.product.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = `₱${shoppingCart.total.toLocaleString()}`;
}

// Setup real-time form validation
function setupRealTimeValidation() {
    const formInputs = checkoutForm.querySelectorAll('input, select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Enhanced validation functions
function validatePhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
}

function validateCreditCard(cardNumber) {
    const cardRegex = /^[0-9]{16}$/;
    return cardRegex.test(cardNumber.replace(/\s/g, ''));
}

function validateCVV(cvv) {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
}

function validateExpiryDate(expiryDate) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (parseInt(year) < currentYear) return false;
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
    
    return true;
}

// Simple field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    if (isValid && fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (isValid && fieldName === 'phone' && value) {
        if (!validatePhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (isValid && fieldName === 'cardNumber' && value) {
        if (!validateCreditCard(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid 16-digit card number';
        }
    }
    
    if (isValid && fieldName === 'cvv' && value) {
        if (!validateCVV(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV (3-4 digits)';
        }
    }
    
    if (isValid && fieldName === 'expiryDate' && value) {
        if (!validateExpiryDate(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
        }
    }
    
    if (isValid) {
        field.classList.remove('error');
        errorElement.textContent = '';
    } else {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    }
    
    return isValid;
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

// Validate entire form
function validateForm() {
    const formInputs = checkoutForm.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    formInputs.forEach(input => {
        const event = new Event('blur');
        input.dispatchEvent(event);
        
        if (input.classList.contains('error')) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle checkout form submission
function handleCheckoutSubmit(e) {
    e.preventDefault();
    console.log('Checkout form submitted');
    
    if (!validateForm()) {
        showToast('Please fix the errors in the form');
        return;
    }
    
    submitOrderBtn.disabled = true;
    const originalText = submitOrderBtn.innerHTML;
    submitOrderBtn.innerHTML = '<div class="loading-spinner"></div> Processing...';
    
    // Simulate processing delay
    setTimeout(() => {
        processOrder();
        submitOrderBtn.disabled = false;
        submitOrderBtn.innerHTML = originalText;
    }, 2000);
}

// Process the order
function processOrder() {
    const formData = new FormData(checkoutForm);
    
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            zip: formData.get('zip'),
            country: formData.get('country')
        },
        items: shoppingCart.getItems(),
        total: shoppingCart.total,
        orderDate: new Date().toISOString()
    };
    
    console.log('Processing order:', orderData);
    
    orderHistory.addOrder(shoppingCart, shoppingCart.total);
    showToast(`Order placed successfully! Total: ₱${shoppingCart.total.toLocaleString()}`);
    
    shoppingCart.clear();
    resetCheckoutForm();
    toggleCheckoutModal();
    updateCartUI();
}

// Reset checkout form
function resetCheckoutForm() {
    if (checkoutForm) {
        checkoutForm.reset();
    }
    
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
}

// PROCEED TO CHECKOUT FUNCTION - FIXED
function proceedToCheckout() {
    console.log('Proceed to checkout clicked');
    
    if (shoppingCart.size === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Close cart modal and open checkout modal
    toggleCart();
    setTimeout(() => {
        toggleCheckoutModal();
    }, 300);
}

// Open product modal with product details
function openProductModal(productId) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    currentProductModal = product;

    productModalName.textContent = product.name;
    productModalCategory.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    productModalPrice.textContent = `₱${product.price.toLocaleString()}`;
    productModalDescription.textContent = product.description;
    
    productMainImage.src = product.image;
    productMainImage.alt = product.name;
    
    const allImages = [product.image, ...product.additionalImages];
    productThumbnails.innerHTML = allImages.map((img, index) => `
        <img src="${img}" alt="${product.name} ${index + 1}" class="product-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
    `).join('');
    
    modalQuantity.textContent = '1';
    modalWishlistBtn.classList.toggle('active', wishlist.includes(product.id));
    
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            productMainImage.src = allImages[index];
            document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    toggleProductModal();
}

// Add product to cart with error handling
function addToCart(productId, quantity = null) {
    try {
        const product = productCatalog.find(p => p.id === productId);
        if (!product) return;

        let qty = quantity;
        if (!qty) {
            const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
            qty = parseInt(quantityElement.textContent);
        }

        const existingItem = shoppingCart.getItems().find(item => item.product.id === productId);
        
        if (existingItem) {
            const action = shoppingCart.updateQuantity(productId, existingItem.quantity + qty);
            actionHistory.push({
                type: 'update',
                productId: productId,
                oldQuantity: action.oldQuantity,
                newQuantity: action.newQuantity
            });
        } else {
            shoppingCart.addItem(product, qty);
            actionHistory.push({
                type: 'add',
                productId: productId,
                quantity: qty
            });
        }

        updateCartUI();
        saveCartToStorage();
        showToast(`${product.name} added to cart!`);
        
        if (!quantity) {
            resetProductQuantity(productId);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast(error.message);
    }
}

// Remove product from cart
function removeFromCart(productId) {
    const removedItem = shoppingCart.removeItem(productId);
    if (removedItem) {
        actionHistory.push({
            type: 'remove',
            productId: productId,
            product: removedItem.product,
            quantity: removedItem.quantity
        });
        updateCartUI();
        showToast(`${removedItem.product.name} removed from cart`);
    }
}

// Update product quantity in UI (before adding to cart)
function updateProductQuantity(productId, isIncrease) {
    const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
    let quantity = parseInt(quantityElement.textContent);
    
    if (isIncrease) {
        quantity++;
    } else if (quantity > 1) {
        quantity--;
    }
    
    quantityElement.textContent = quantity;
}

// Update cart item quantity
function updateCartQuantity(productId, isIncrease) {
    try {
        const cartItem = shoppingCart.getItems().find(item => item.product.id === productId);
        if (!cartItem) return;

        const oldQuantity = cartItem.quantity;
        const newQuantity = isIncrease ? oldQuantity + 1 : Math.max(1, oldQuantity - 1);
        
        if (oldQuantity !== newQuantity) {
            shoppingCart.updateQuantity(productId, newQuantity);
            actionHistory.push({
                type: 'update',
                productId: productId,
                oldQuantity: oldQuantity,
                newQuantity: newQuantity
            });
            updateCartUI();
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        showToast(error.message);
    }
}

// Reset product quantity in product card
function resetProductQuantity(productId) {
    const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
    quantityElement.textContent = '1';
}

// Toggle product in wishlist
function toggleWishlist(productId, button) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        if (button) button.classList.add('active');
        showToast(`${product.name} added to wishlist`);
    } else {
        wishlist.splice(index, 1);
        if (button) button.classList.remove('active');
        showToast(`${product.name} removed from wishlist`);
    }
    
    updateWishlistUI();
    saveWishlistToStorage();
}

// Move product from wishlist to cart
function moveToCart(productId) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    shoppingCart.addItem(product, 1);
    actionHistory.push({
        type: 'add',
        productId: productId,
        quantity: 1
    });

    const index = wishlist.indexOf(productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
    }

    updateCartUI();
    updateWishlistUI();
    
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    if (wishlistBtn) {
        wishlistBtn.classList.remove('active');
    }
    
    showToast(`${product.name} moved to cart`);
}

// Remove product from wishlist
function removeFromWishlist(productId) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.indexOf(productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
    }

    updateWishlistUI();
    
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    if (wishlistBtn) {
        wishlistBtn.classList.remove('active');
    }
    
    showToast(`${product.name} removed from wishlist`);
}

// Update cart UI function
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const undoBtn = document.getElementById('undo-btn');
    const items = shoppingCart.getItems();
    
    if (items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h4>Your Cart is Empty</h4>
                <p>Add some beautiful flowers to get started!</p>
                <button class="continue-shopping" onclick="toggleCart()">Start Shopping</button>
            </div>
        `;
    } else {
        cartItems.innerHTML = items.map(item => `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                <div class="cart-item-content">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.product.name}</div>
                        <div class="cart-item-price">₱${item.product.price.toLocaleString()} each</div>
                        <div class="cart-item-quantity">
                            <button class="cart-quantity-btn decrease" data-id="${item.product.id}">-</button>
                            <span style="font-weight: bold; min-width: 30px; text-align: center;">${item.quantity}</span>
                            <button class="cart-quantity-btn increase" data-id="${item.product.id}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="item-total">
                            ₱${(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        <button class="remove-item" data-id="${item.product.id}" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (cartTotal) cartTotal.textContent = `₱${shoppingCart.total.toLocaleString()}`;
    if (cartCount) cartCount.textContent = shoppingCart.size;
    if (undoBtn) undoBtn.style.display = actionHistory.size() > 0 ? 'block' : 'none';
}

// Update wishlist UI with new design
function updateWishlistUI() {
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistEmpty = document.getElementById('wishlist-empty');
    const wishlistActions = document.getElementById('wishlist-actions');
    const wishlistCount = document.getElementById('wishlist-count');
    const items = productCatalog.filter(product => wishlist.includes(product.id));
    
    if (wishlistCount) wishlistCount.textContent = items.length;
    
    if (items.length === 0) {
        if (wishlistItems) wishlistItems.style.display = 'none';
        if (wishlistActions) wishlistActions.style.display = 'none';
        if (wishlistEmpty) wishlistEmpty.classList.add('active');
    } else {
        if (wishlistItems) {
            wishlistItems.style.display = 'grid';
            wishlistItems.innerHTML = items.map(product => `
                <div class="wishlist-item">
                    <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
                    <div class="wishlist-item-content">
                        <div class="wishlist-item-details">
                            <div class="wishlist-item-name">${product.name}</div>
                            <div class="wishlist-item-category">${product.category.replace('-', ' ')}</div>
                            <div class="wishlist-item-price">₱${product.price.toLocaleString()}</div>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="move-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                            <button class="remove-wishlist" data-id="${product.id}" title="Remove from wishlist">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        if (wishlistActions) wishlistActions.style.display = 'flex';
        if (wishlistEmpty) wishlistEmpty.classList.remove('active');
    }
}

// Add event listeners for new wishlist buttons
function setupWishlistEventListeners() {
    // Clear wishlist button
    const clearWishlistBtn = document.getElementById('clear-wishlist');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', clearWishlist);
    }
    
    // Share wishlist button
    const shareWishlistBtn = document.getElementById('share-wishlist');
    if (shareWishlistBtn) {
        shareWishlistBtn.addEventListener('click', shareWishlist);
    }
}

// Clear entire wishlist
function clearWishlist() {
    if (wishlist.length === 0) return;
    
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        updateWishlistUI();
        showToast('Wishlist cleared');
        
        // Update all wishlist buttons on the page
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

// Share wishlist functionality
function shareWishlist() {
    const items = productCatalog.filter(product => wishlist.includes(product.id));
    
    if (items.length === 0) {
        showToast('Your wishlist is empty!');
        return;
    }
    
    const wishlistText = items.map(item => `• ${item.name} - ₱${item.price.toLocaleString()}`).join('\n');
    const shareText = `My Flower Wishlist from Fiora Atelier:\n\n${wishlistText}\n\nTotal: ${items.length} items`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Flower Wishlist',
            text: shareText,
            url: window.location.href
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

// Copy to clipboard utility
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Wishlist copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Wishlist copied to clipboard!');
    });
}

// Undo last action
function undoLastAction() {
    const lastAction = actionHistory.pop();
    if (!lastAction) return;

    switch (lastAction.type) {
        case 'add':
            shoppingCart.removeItem(lastAction.productId);
            showToast('Added item removed');
            break;
        case 'remove':
            const product = productCatalog.find(p => p.id === lastAction.productId);
            if (product) {
                shoppingCart.addItem(product, lastAction.quantity);
                showToast('Removed item restored');
            }
            break;
        case 'update':
            shoppingCart.updateQuantity(lastAction.productId, lastAction.oldQuantity);
            showToast('Quantity change reverted');
            break;
    }

    updateCartUI();
}

function initGallery() {
    let filterBtns = document.querySelectorAll('.filter-btn');
    let galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];

    // Function to refresh gallery items (call this after adding new items)
    function refreshGalleryItems() {
        galleryItems = document.querySelectorAll('.gallery-item');
        galleryImages = []; // Clear existing images
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4');
            const description = item.querySelector('p');
            
            if (img && title && description) {
                galleryImages.push({
                    src: img.src,
                    title: title.textContent,
                    description: description.textContent
                });
            }
        });
    }

    // Initialize gallery images
    refreshGalleryItems();

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    // Force reflow
                    void item.offsetWidth;
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox functionality
    function setupLightboxEvents() {
        galleryItems.forEach((item, index) => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            
            // Remove existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Get fresh references
            const freshItem = document.querySelectorAll('.gallery-item')[index];
            const freshViewBtn = freshItem.querySelector('.gallery-view-btn');
            
            // Click on view button
            freshViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(index);
            });

            // Click on gallery item
            freshItem.addEventListener('click', () => {
                openLightbox(index);
            });
        });
    }

    setupLightboxEvents();

    function openLightbox(index) {
        if (index >= galleryImages.length) return;
        
        currentImageIndex = index;
        const image = galleryImages[index];
        
        lightboxImage.src = image.src;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;
        
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }
        
        const image = galleryImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;
    }

    // Event listeners for lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on overlay click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Public function to refresh gallery (call this after adding new items dynamically)
    window.refreshGallery = function() {
        refreshGalleryItems();
        setupLightboxEvents();
        filterBtns = document.querySelectorAll('.filter-btn'); // Refresh buttons too
    };
}

// Search functionality
let searchTimeout;

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        if (query === '') {
            renderAllProducts();
            return;
        }

        if (query.length > 0) {
            productContainer.innerHTML = `
                <div class="search-loading" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <div class="loading-spinner" style="margin: 0 auto;"></div>
                    <p>Searching for "${query}"...</p>
                </div>
            `;
        }

        // Search across ALL categories and ALL seasonal products
        const allProducts = [
            ...productCatalog,
            ...(window.fallProducts || []),
            ...(window.springProducts || []),
            ...(window.summerProducts || []),
            ...(window.winterProducts || [])
        ];

        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
        );

        productContainer.innerHTML = filteredProducts.length > 0 
            ? filteredProducts.map(product => `
                <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                    ${product.category === 'best-sellers' ? '<div class="product-badge">Bestseller</div>' : ''}
                    ${product.category === 'fall' ? '<div class="product-badge" style="background: #8B4513;">Autumn</div>' : ''}
                    ${product.category === 'spring' ? '<div class="product-badge" style="background: #90EE90;">Spring</div>' : ''}
                    ${product.category === 'summer' ? '<div class="product-badge" style="background: #FFD700;">Summer</div>' : ''}
                    ${product.category === 'winter' ? '<div class="product-badge" style="background: #87CEEB;">Winter</div>' : ''}
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description.substring(0, 80)}...</div>
                        <div class="product-price">₱${product.price.toLocaleString()}</div>
                        <div class="product-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-id="${product.id}" aria-label="Decrease quantity">-</button>
                                <span class="quantity" data-id="${product.id}">1</span>
                                <button class="quantity-btn plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                            </div>
                            <div class="action-buttons">
                                <button class="add-to-cart" data-id="${product.id}" aria-label="Add to cart">Add to Cart</button>
                                <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')
            : `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                  <i class="fas fa-search" style="font-size: 3rem; color: var(--secondary); margin-bottom: 1rem;"></i>
                  <h3 style="color: var(--primary); margin-bottom: 0.5rem;">No products found</h3>
                  <p style="color: var(--text);">We couldn't find any products matching "${query}"</p>
                  <p style="color: var(--text); font-size: 0.9rem; margin-top: 1rem;">Try searching for: roses, tulips, wedding, birthday, or seasonal flowers</p>
               </div>`;
        
        if (query !== '') {
            document.querySelectorAll('.product-name').forEach(name => {
                const text = name.textContent;
                const regex = new RegExp(`(${query})`, 'gi');
                name.innerHTML = text.replace(regex, '<mark>$1</mark>');
            });
        }
    }, 300);
}

// FIXED Cherry Blossom Function - COVERS ENTIRE WIDTH
function createCherryBlossoms() {
    const container = document.getElementById('cherry-blossom-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create 50 cherry blossoms for better coverage
    for (let i = 0; i < 100; i++) {
        const blossom = document.createElement('div');
        blossom.className = 'cherry-blossom';
        
        // Random style for variety
        const style = Math.floor(Math.random() * 3) + 1;
        blossom.classList.add(`style-${style}`);
        
        // FIXED: Random positions across ENTIRE width
        const startX = (Math.random() * 100); // 0% to 100% - covers entire width
        const endX = startX + (Math.random() * 40 - 20); // -20% to +20% movement
        
        // Random animation properties
        const duration = Math.random() * 15 + 10; // 10-25 seconds
        const delay = Math.random() * 25; // 0-25 second delay
        const size = Math.random() * 0.7 + 0.6; // 0.6x to 1.3x size
        
        blossom.style.setProperty('--start-x', `${startX}vw`); // Use vw units for full width
        blossom.style.setProperty('--end-x', `${endX}vw`);
        blossom.style.animationDuration = `${duration}s`;
        blossom.style.animationDelay = `${delay}s`;
        blossom.style.transform = `scale(${size})`;
        
        container.appendChild(blossom);
    }
}

// Animate counting numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toLocaleString() + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target.toLocaleString() + '+';
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize enhanced hero
function initEnhancedHero() {
    createCherryBlossoms();
    animateCounters();
    
    // Recreate cherry blossoms every 45 seconds for variety
    setInterval(createCherryBlossoms, 45000);
}

// Show toast notification
function showToast(message) {
    if (!toastMessage || !toast) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize checkout functionality
function initCheckout() {
    setupRealTimeValidation();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);