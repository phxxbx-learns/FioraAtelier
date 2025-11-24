/**
 * Products UI Management
 * Handles product rendering and product-related interactions
 */

/**
 * Render all products to their respective sections
 */
function renderAllProducts() {
    renderBestSellers();
    renderFreshFlowers();
    renderSyntheticFlowers();
}

/**
 * Render best sellers products
 */
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

/**
 * Render fresh flowers products
 */
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

/**
 * Render synthetic flowers products
 */
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

/**
 * Render products based on current category
 */
function renderProducts() {
    if (currentCategory === 'all') {
        renderBestSellers();
    } else {
        // For other categories, you can implement filtering
        const filteredProducts = productCatalog.filter(product => 
            product.category === currentCategory
        );
        console.log(`Rendering ${currentCategory} products:`, filteredProducts.length);
    }
}

/**
 * Update product quantity in UI (before adding to cart)
 */
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