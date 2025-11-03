// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Load Lottie animation to replace hero image
function initHeroAnimation() {
    // Method 1: Using Lottie Player (Easier)
    const animationContainer = document.getElementById('lottie-hero');
    
    // Create Lottie player
    const lottiePlayer = document.createElement('lottie-player');
    lottiePlayer.setAttribute('src', 'pics/floral.json');
    lottiePlayer.setAttribute('background', 'transparent');
    lottiePlayer.setAttribute('speed', '1');
    lottiePlayer.setAttribute('loop', '');
    lottiePlayer.setAttribute('autoplay', '');
    lottiePlayer.style.width = '100%';
    lottiePlayer.style.height = '100%';
    
    animationContainer.appendChild(lottiePlayer);
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
        "A vibrant pink arrangement perfect for celebrations. This stunning bouquet features a mix of premium pink roses, peonies, and carnations, carefully arranged to create a breathtaking display of color and elegance. Perfect for birthdays, anniversaries, or just to brighten someone's day.",
        ["pics/b1.webp", "pics/b2.webp", "pics/b3.webp"]),
    
    new Product(2, "Bright but Light", 2850.00, "best-sellers", "pics/b2.webp", 
        "A cheerful mix of bright flowers to light up any room. This arrangement combines sunflowers, daisies, and yellow roses to create a sunny, uplifting bouquet that brings warmth and happiness to any space.",
        ["pics/b2.webp", "pics/b1.webp", "pics/b3.webp"]),
    
    new Product(3, "Berry Cheesecake", 6880.00, "best-sellers", "pics/b3.webp", 
        "Rich tones of berry and cream in an elegant display. This luxurious arrangement features deep burgundy roses, purple lisianthus, and white hydrangeas, creating a sophisticated color palette that's both modern and timeless.",
        ["pics/b3.webp", "pics/b1.webp", "pics/b2.webp"]),
    
    new Product(4, "Dream Land", 3990.00, "best-sellers", "pics/b4.webp", 
        "Soft pastel blooms that evoke a dreamy atmosphere. Features lavender, pale pink roses, and white hydrangeas for a delicate and romantic arrangement.",
        ["pics/b4.webp", "pics/b1.webp", "pics/b2.webp"]),
    
    new Product(5, "Pinkish Belle", 5390.00, "best-sellers", "pics/b5.webp", 
        "Delicate pink flowers arranged with timeless elegance. A beautiful combination of pink peonies, roses, and carnations.",
        ["pics/b5.webp", "pics/b1.webp", "pics/b2.webp"]),
    
    // Fresh Flowers
    new Product(7, "Blooms Blush", 15999.00, "fresh", "pics/f1.jpg", 
        "A luxurious bouquet of premium fresh blooms featuring garden roses, ranunculus, and eucalyptus. Each stem is hand-selected for perfection, creating an arrangement that speaks of luxury and refinement.",
        ["pics/f1.jpg", "pics/f2.jpg", "pics/f3.jpg"]),
    
    new Product(8, "Blissful Roses", 6670.00, "fresh", "pics/f2.jpg", 
        "Classic roses arranged to perfection. This timeless bouquet features two dozen premium red roses, symbolizing deep love and affection. Perfect for romantic occasions or to express heartfelt emotions.",
        ["pics/f2.jpg", "pics/f1.jpg", "pics/f3.jpg"]),
    
    new Product(9, "Rosette", 3490.00, "fresh", "pics/ff3.webp", 
        "A charming arrangement of roses and complementary flowers. Features pink and white roses with baby's breath for a classic look.",
        ["pics/ff3.webp", "pics/f1.jpg", "pics/f2.jpg"]),
    
    // Synthetic Flowers
    new Product(13, "Eterna", 349.00, "synthetic", "pics/s1.jpg", 
        "Lifelike synthetic flowers that last forever. These beautifully crafted roses maintain their vibrant color and delicate appearance year after year, requiring no maintenance or watering.",
        ["pics/s1.jpg", "pics/s2.jpg", "pics/s3.jpg"]),
    
    new Product(14, "Silken", 299.00, "synthetic", "pics/ff2.jpg", 
        "Silk flowers with remarkable realism. Our silk arrangements capture the delicate beauty of real flowers with incredible attention to detail, from the veining in the leaves to the natural curve of each petal.",
        ["pics/ff2.jpg", "pics/s1.jpg", "pics/s2.jpg"]),
    
    new Product(15, "Velvessa", 349.00, "synthetic", "pics/s2.jpg", 
        "Velvety textures that mimic real petals. These synthetic flowers have a soft, realistic feel that closely resembles fresh blooms.",
        ["pics/s2.jpg", "pics/s1.jpg", "pics/ff2.jpg"]),
    
    // Seasonal Flowers
    new Product(19, "Spring Tulips", 1999.00, "seasonal", "pics/spring1.webp", 
        "Fresh spring tulips in vibrant colors. Celebrate the arrival of spring with this cheerful bouquet of mixed tulips in shades of pink, yellow, and purple. Each stem represents new beginnings and fresh starts.",
        ["pics/spring1.webp", "pics/spring2.jpg", "pics/spring3.jpg"]),
    
    new Product(20, "Summer Sunflowers", 2499.00, "seasonal", "pics/summer1.jpg", 
        "Bright sunflowers to capture summer joy. These vibrant flowers bring the warmth and happiness of summer into any space with their cheerful yellow petals and dark centers.",
        ["pics/summer1.jpg", "pics/spring1.webp", "pics/fall.jpg"])
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
const cartSidebar = document.getElementById('cart-sidebar');
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
const navLinks = document.querySelectorAll('.nav-menu li a');
const sortSelect = document.getElementById('sort-select');

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

// Initialize the application
function init() {
    console.log('Initializing application...');
    renderProducts();
    setupEventListeners();
    updateCartUI();
    updateWishlistUI();
    initCheckout();
    initHeroAnimation();
}

// Render products to the page
function renderProducts() {
    productContainer.innerHTML = '<div class="loading">Loading products...</div>';
    
    setTimeout(() => {
        let productsToShow = productCatalog;
        
        // Filter by category if not 'all'
        if (currentCategory !== 'all') {
            productsToShow = productCatalog.filter(product => 
                product.category === currentCategory
            );
        }

        // Sort products using our custom sorting algorithms
        productsToShow = sortProducts(productsToShow, sortSelect.value);
        
        // Render products
        productContainer.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                ${product.category === 'best-sellers' ? '<div class="product-badge">Bestseller</div>' : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description.substring(0, 80)}...</div>
                    <div class="product-price">₱${product.price.toLocaleString()}</div>
                    <div class="product-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-id="${product.id}">-</button>
                            <span class="quantity" data-id="${product.id}">1</span>
                            <button class="quantity-btn plus" data-id="${product.id}">+</button>
                        </div>
                        <div class="action-buttons">
                            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                            <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }, 500);
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

// Setup event listeners
function setupEventListeners() {
    // Cart toggle
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Wishlist toggle
    wishlistIcon.addEventListener('click', toggleWishlistModal);
    closeWishlist.addEventListener('click', toggleWishlistModal);
    
    // Product modal
    closeProductModal.addEventListener('click', toggleProductModal);
    
    // Overlay
    overlay.addEventListener('click', function() {
        toggleCart();
        toggleWishlistModal();
        toggleProductModal();
        toggleCheckoutModal();
    });

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
    sortSelect.addEventListener('change', function() {
        renderProducts();
    });

    // Product interactions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }

        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const isPlus = e.target.classList.contains('plus');
            updateProductQuantity(productId, isPlus);
        }

        if (e.target.closest('.wishlist-btn')) {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            const productId = parseInt(wishlistBtn.getAttribute('data-id'));
            toggleWishlist(productId, wishlistBtn);
        }

        if (e.target.closest('.product-card')) {
            const productCard = e.target.closest('.product-card');
            if (!e.target.closest('.product-actions')) {
                const productId = parseInt(productCard.getAttribute('data-id'));
                openProductModal(productId);
            }
        }
    });

    // Cart interactions
    cartItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }

        if (e.target.classList.contains('cart-quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            updateCartQuantity(productId, isIncrease);
        }
    });

    // Wishlist interactions
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

    // Product modal interactions
    modalMinus.addEventListener('click', function() {
        let quantity = parseInt(modalQuantity.textContent);
        if (quantity > 1) {
            modalQuantity.textContent = quantity - 1;
        }
    });

    modalPlus.addEventListener('click', function() {
        let quantity = parseInt(modalQuantity.textContent);
        modalQuantity.textContent = quantity + 1;
    });

    modalAddToCart.addEventListener('click', function() {
        if (currentProductModal) {
            const quantity = parseInt(modalQuantity.textContent);
            addToCart(currentProductModal.id, quantity);
            toggleProductModal();
        }
    });

    modalWishlistBtn.addEventListener('click', function() {
        if (currentProductModal) {
            toggleWishlist(currentProductModal.id, modalWishlistBtn);
            const productCardBtn = document.querySelector(`.wishlist-btn[data-id="${currentProductModal.id}"]`);
            if (productCardBtn) {
                productCardBtn.classList.toggle('active', wishlist.includes(currentProductModal.id));
            }
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', proceedToCheckout);

    // Undo button
    undoBtn.addEventListener('click', undoLastAction);

    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

// Initialize checkout functionality
function initCheckout() {
    console.log('Initializing checkout...');
    
    if (closeCheckout) {
        closeCheckout.addEventListener('click', toggleCheckoutModal);
    }
    
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', toggleCheckoutModal);
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    setupRealTimeValidation();
}

// Toggle checkout modal
function toggleCheckoutModal() {
    console.log('Toggle checkout modal called');
    
    if (!checkoutModal) {
        console.error('Checkout modal not found!');
        return;
    }
    
    checkoutModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = checkoutModal.classList.contains('active') ? 'hidden' : '';
    
    if (checkoutModal.classList.contains('active')) {
        console.log('Opening checkout modal');
        populateOrderSummary();
    } else {
        console.log('Closing checkout modal');
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
    submitOrderBtn.innerHTML = '<div class="loading"></div> Processing...';
    
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

// PROCEED TO CHECKOUT FUNCTION - THIS IS THE CORRECT ONE
function proceedToCheckout() {
    console.log('Proceed to checkout clicked');
    
    if (shoppingCart.size === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    toggleCheckoutModal();
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    
    if (cartSidebar.classList.contains('active')) {
        wishlistModal.classList.remove('active');
        productModal.classList.remove('active');
        checkoutModal.classList.remove('active');
    }
}

// Toggle wishlist modal
function toggleWishlistModal() {
    wishlistModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = wishlistModal.classList.contains('active') ? 'hidden' : '';
    
    if (wishlistModal.classList.contains('active')) {
        cartSidebar.classList.remove('active');
        productModal.classList.remove('active');
        checkoutModal.classList.remove('active');
    }
}

// Toggle product modal
function toggleProductModal() {
    productModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = productModal.classList.contains('active') ? 'hidden' : '';
    
    if (productModal.classList.contains('active')) {
        cartSidebar.classList.remove('active');
        wishlistModal.classList.remove('active');
        checkoutModal.classList.remove('active');
    } else {
        currentProductModal = null;
    }
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

// Add product to cart
function addToCart(productId, quantity = null) {
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
    showToast(`${product.name} added to cart!`);
    
    if (!quantity) {
        resetProductQuantity(productId);
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

// Update cart UI
function updateCartUI() {
    const items = shoppingCart.getItems();
    cartItems.innerHTML = items.length > 0 
        ? items.map(item => `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-price">₱${item.product.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-btn decrease" data-id="${item.product.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-quantity-btn increase" data-id="${item.product.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.product.id}">Remove</button>
                </div>
            </div>
        `).join('')
        : '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';

    cartTotal.textContent = `₱${shoppingCart.total.toLocaleString()}`;
    cartCount.textContent = shoppingCart.size;
    undoBtn.style.display = actionHistory.size() > 0 ? 'block' : 'none';
}

// Update wishlist UI
function updateWishlistUI() {
    const items = productCatalog.filter(product => wishlist.includes(product.id));
    wishlistItems.innerHTML = items.length > 0 
        ? items.map(product => `
            <div class="wishlist-item">
                <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
                <div class="wishlist-item-details">
                    <div class="wishlist-item-name">${product.name}</div>
                    <div class="wishlist-item-price">₱${product.price.toLocaleString()}</div>
                    <button class="move-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="remove-wishlist" data-id="${product.id}">Remove</button>
                </div>
            </div>
        `).join('')
        : '<div class="empty-wishlist">Your wishlist is empty</div>';

    wishlistCount.textContent = wishlist.length;
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

// Search

let searchTimeout;

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Set new timeout (debounce only)
    searchTimeout = setTimeout(() => {
        if (query === '') {
            renderProducts();
            return;
        }

        // Show loading state ONLY if we have a query
        if (query.length > 0) {
            productContainer.innerHTML = `
                <div class="search-loading" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <div class="loading" style="margin: 0 auto;"></div>
                    <p>Searching for "${query}"...</p>
                </div>
            `;
        }

        const filteredProducts = productCatalog.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        // REMOVE THE INNER setTimeout! Render immediately:
        productContainer.innerHTML = filteredProducts.length > 0 
            ? filteredProducts.map(product => `
                <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                    ${product.category === 'best-sellers' ? '<div class="product-badge">Bestseller</div>' : ''}
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description.substring(0, 80)}...</div>
                        <div class="product-price">₱${product.price.toLocaleString()}</div>
                        <div class="product-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-id="${product.id}">-</button>
                                <span class="quantity" data-id="${product.id}">1</span>
                                <button class="quantity-btn plus" data-id="${product.id}">+</button>
                            </div>
                            <div class="action-buttons">
                                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                                <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}">
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
               </div>`;
        
        if (query !== '') {
            document.querySelectorAll('.product-name').forEach(name => {
                const text = name.textContent;
                const regex = new RegExp(`(${query})`, 'gi');
                name.innerHTML = text.replace(regex, '<mark>$1</mark>');
            });
        }
    }, 300); // Debounce delay only
}

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);