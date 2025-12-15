/**
 * Main Application Entry Point
 * Initializes all components and sets up event listeners
 */

/**
 * Error handler for InfinityFree compatibility
 */
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', message, 'at', source, 'line', lineno);
    return false;
};

// Add this to catch unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/**
 * Wait for all resources to load
 */
function waitForResources() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
}

/**
 * Check if required elements exist
 */
function checkRequiredElements() {
    const requiredElements = [
        'productContainer', 'sortSelect', 'cartIcon'
    ];
    
    for (const elementName of requiredElements) {
        if (!window[elementName]) {
            console.warn(`Required element ${elementName} not found`);
        }
    }
    
    // Check if productCatalog exists
    if (!window.productCatalog) {
        console.error('productCatalog is not defined!');
        return false;
    }
    
    return true;
}

/**
 * Setup all event listeners for the application
 */
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Check if elements exist before adding listeners
    if (!cartIcon || !sortSelect) {
        console.error('Essential elements missing for event listeners');
        return;
    }
    
    // Cart toggle
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    // Wishlist toggle
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', toggleWishlistModal);
    }
    if (closeWishlist) {
        closeWishlist.addEventListener('click', toggleWishlistModal);
    }
    
    // Product modal
    if (closeProductModal) {
        closeProductModal.addEventListener('click', toggleProductModal);
    }
    
    // Checkout modal
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
    if (mobileNavLinks && mobileNavLinks.length > 0) {
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
    }
    
    // Overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            toggleCart();
            toggleWishlistModal();
            toggleProductModal();
            toggleCheckoutModal();
            toggleMobileNav();
        });
    }

    // Checkout form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Navigation filtering - FIXED with null check
    if (navLinks && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', async function(e) {
                e.preventDefault();
                console.log('Nav link clicked:', this.getAttribute('href'));
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = this.getAttribute('href').substring(1);
                console.log('Target section:', targetId);
                
                if (['best-sellers', 'fresh', 'synthetic', 'seasonal'].includes(targetId)) {
                    currentCategory = targetId === 'best-sellers' ? 'all' : targetId;
                    console.log('Category changed to:', currentCategory);
                    try {
                        await renderProducts();
                    } catch (error) {
                        console.error('Error rendering products:', error);
                    }
                }
                
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
    }

    // Sort functionality - FIXED with null check
    if (sortSelect) {
        sortSelect.addEventListener('change', async function() {
            console.log('Sort select changed to:', this.value);
            try {
                await renderProducts();
            } catch (error) {
                console.error('Error sorting products:', error);
            }
        });
    }

    // Product interactions - SAFE VERSION
    document.addEventListener('click', function(e) {
        try {
            // Add to cart button
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = parseInt(button.getAttribute('data-id'));
                if (!isNaN(productId)) {
                    addToCart(productId);
                }
            }

            // Quantity buttons
            if (e.target.classList.contains('quantity-btn')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                if (!isNaN(productId)) {
                    const isPlus = e.target.classList.contains('plus');
                    updateProductQuantity(productId, isPlus);
                }
            }

            // Wishlist buttons
            if (e.target.closest('.wishlist-btn')) {
                const wishlistBtn = e.target.closest('.wishlist-btn');
                const productId = parseInt(wishlistBtn.getAttribute('data-id'));
                if (!isNaN(productId)) {
                    toggleWishlist(productId, wishlistBtn);
                }
            }

            // Product card click for modal
            if (e.target.closest('.product-card')) {
                const productCard = e.target.closest('.product-card');
                if (!e.target.closest('.product-actions')) {
                    const productId = parseInt(productCard.getAttribute('data-id'));
                    if (!isNaN(productId)) {
                        openProductModal(productId);
                    }
                }
            }
        } catch (error) {
            console.error('Error in product interaction:', error);
        }
    });

    // Cart interactions
    document.addEventListener('click', function(e) {
        try {
            // Remove item from cart
            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                const productId = parseInt(button.getAttribute('data-id'));
                if (!isNaN(productId)) {
                    removeFromCart(productId);
                }
            }

            // Cart quantity buttons
            if (e.target.classList.contains('cart-quantity-btn')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                if (!isNaN(productId)) {
                    const isIncrease = e.target.classList.contains('increase');
                    updateCartQuantity(productId, isIncrease);
                }
            }
        } catch (error) {
            console.error('Error in cart interaction:', error);
        }
    });

    // Wishlist interactions
    if (wishlistItems) {
        wishlistItems.addEventListener('click', function(e) {
            try {
                if (e.target.classList.contains('move-to-cart') || e.target.closest('.move-to-cart')) {
                    const button = e.target.classList.contains('move-to-cart') ? e.target : e.target.closest('.move-to-cart');
                    const productId = parseInt(button.getAttribute('data-id'));
                    if (!isNaN(productId)) {
                        moveToCart(productId);
                    }
                }
            
                // Remove from wishlist button
                if (e.target.classList.contains('remove-wishlist') || e.target.closest('.remove-wishlist')) {
                    const button = e.target.classList.contains('remove-wishlist') ? e.target : e.target.closest('.remove-wishlist');
                    const productId = parseInt(button.getAttribute('data-id'));
                    if (!isNaN(productId)) {
                        removeFromWishlist(productId);
                    }
                }
            } catch (error) {
                console.error('Error in wishlist interaction:', error);
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

/**
 * Debug function to check product data
 */
function debugProductData() {
    console.log('=== DEBUG: Product Data ===');
    console.log('Total products in catalog:', productCatalog ? productCatalog.length : 0);
    
    if (productCatalog && productCatalog.length > 0) {
        console.log('Product categories found:', [...new Set(productCatalog.map(p => p.category))]);
        console.log('First 3 products:');
        productCatalog.slice(0, 3).forEach(p => {
            console.log(`- ID: ${p.id}, Name: "${p.name}", Price: ₱${p.price}, Category: "${p.category}"`);
        });
    } else {
        console.error('productCatalog is empty or undefined!');
    }
    
    console.log('Current category:', currentCategory);
    console.log('Sort select value:', sortSelect ? sortSelect.value : 'N/A');
    console.log('Wishlist items:', wishlist.length);
    console.log('=== END DEBUG ===');
}

/**
 * Initialize the application with error handling
 */
async function init() {
    console.log('Initializing Fiora Atelier application...');
    
    try {
        // Wait for all resources
        await waitForResources();
        
        // Initialize global instances
        if (typeof initializeGlobalInstances === 'function') {
            initializeGlobalInstances();
        } else {
            console.error('initializeGlobalInstances function not found!');
        }
        
        // Debug product data
        debugProductData();
        
        // Check required elements
        if (!checkRequiredElements()) {
            console.error('Some required elements are missing');
            // Try to load products anyway
        }
        
        // Load data from storage
        if (typeof loadCartFromStorage === 'function') {
            loadCartFromStorage();
        }
        if (typeof loadWishlistFromStorage === 'function') {
            loadWishlistFromStorage();
        }
        
        // Initialize UI components
        if (typeof renderAllProducts === 'function') {
            await renderAllProducts();
        }
        
        setupEventListeners();
        
        if (typeof setupWishlistEventListeners === 'function') {
            setupWishlistEventListeners();
        }
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
        if (typeof updateWishlistUI === 'function') {
            updateWishlistUI();
        }
        if (typeof initCheckout === 'function') {
            initCheckout();
        }
        if (typeof initGallery === 'function') {
            initGallery();
        }
        if (typeof initEnhancedHero === 'function') {
            initEnhancedHero();
        }
        
        console.log('Application initialized successfully');
        
        // Force a re-render after 1 second to catch any missed updates
        setTimeout(() => {
            console.log('Performing final check...');
            if (typeof renderProducts === 'function') {
                renderProducts();
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error during initialization:', error);
        
        // Try to at least setup basic functionality
        try {
            setupEventListeners();
        } catch (e) {
            console.error('Even basic setup failed:', e);
        }
    }
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded
    init();
}

// Export functions for debugging
window.debugApp = {
    debugProductData,
    renderProducts: typeof renderProducts === 'function' ? renderProducts : null,
    sortProducts: typeof sortProducts === 'function' ? sortProducts : null
};