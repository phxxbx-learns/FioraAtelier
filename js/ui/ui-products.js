/**
 * Products UI Management
 * Handles product rendering with real-time stock information
 */

/**
 * Render all products to their respective sections
 */
async function renderAllProducts() {
    console.log('renderAllProducts called');
    await renderBestSellers();
    await renderFreshFlowers();
    await renderSyntheticFlowers();
}

/**
 * Render products based on current filter/sort
 */
async function renderProducts() {
    console.log('renderProducts called - Category:', currentCategory, 'Sort:', sortSelect ? sortSelect.value : 'N/A');
    
    if (currentCategory === 'all' || currentCategory === 'best-sellers') {
        console.log('Rendering Best Sellers');
        await renderBestSellers();
    } else if (currentCategory === 'fresh') {
        console.log('Rendering Fresh Flowers');
        await renderFreshFlowers();
    } else if (currentCategory === 'synthetic') {
        console.log('Rendering Synthetic Flowers');
        await renderSyntheticFlowers();
    }
}

/**
 * Render best sellers products with real stock information
 */
async function renderBestSellers() {
    if (!productContainer) {
        console.error('productContainer not found');
        return;
    }
    
    console.log('renderBestSellers called');
    
    // Filter best sellers
    let productsToShow = productCatalog.filter(product => 
        product.category === 'best-sellers' || 
        (product.isBestSeller !== undefined && product.isBestSeller) ||
        (product.featured !== undefined && product.featured)
    );
    
    console.log('Best sellers found:', productsToShow.length);
    
    // If no products match, take first 8 products
    if (productsToShow.length === 0) {
        console.log('No best sellers found, showing first 8 products');
        productsToShow = productCatalog.slice(0, 8);
    }
    
    // Get sort value
    const sortValue = sortSelect ? sortSelect.value : 'default';
    console.log('Sort value for best sellers:', sortValue);
    
    // Sort the products
    productsToShow = sortProducts(productsToShow, sortValue);
    console.log('Products after sorting:', productsToShow.map(p => ({name: p.name, price: p.price})));
    
    let html = '';
    
    for (const product of productsToShow) {
        const stockInfo = await getRealProductStockInfo(product.id);
        html += createProductCardHTML(product, stockInfo);
    }
    
    productContainer.innerHTML = html;
    console.log('Best sellers rendered');
}

/**
 * Render fresh flowers products with real stock information
 */
async function renderFreshFlowers() {
    if (!freshContainer) {
        console.error('freshContainer not found');
        return;
    }
    
    console.log('renderFreshFlowers called');
    
    // Filter fresh flowers
    let freshProducts = productCatalog.filter(product => 
        product.category === 'fresh' || 
        product.type === 'fresh' || 
        (product.tags && product.tags.includes('fresh')) ||
        product.name.toLowerCase().includes('fresh')
    );
    
    console.log('Fresh flowers found:', freshProducts.length);
    
    // Get sort value
    const sortValue = sortSelect ? sortSelect.value : 'default';
    console.log('Sort value for fresh flowers:', sortValue);
    
    // Sort the products
    freshProducts = sortProducts(freshProducts, sortValue);
    
    let html = '';
    
    for (const product of freshProducts) {
        const stockInfo = await getRealProductStockInfo(product.id);
        html += createProductCardHTML(product, stockInfo);
    }
    
    freshContainer.innerHTML = html;
    console.log('Fresh flowers rendered');
}

/**
 * Render synthetic flowers products with real stock information
 */
async function renderSyntheticFlowers() {
    if (!syntheticContainer) {
        console.error('syntheticContainer not found');
        return;
    }
    
    console.log('renderSyntheticFlowers called');
    
    // Filter synthetic flowers
    let syntheticProducts = productCatalog.filter(product => 
        product.category === 'synthetic' || 
        product.type === 'synthetic' || 
        (product.tags && product.tags.includes('artificial')) ||
        product.name.toLowerCase().includes('artificial') ||
        product.name.toLowerCase().includes('faux')
    );
    
    console.log('Synthetic flowers found:', syntheticProducts.length);
    
    // Get sort value
    const sortValue = sortSelect ? sortSelect.value : 'default';
    console.log('Sort value for synthetic flowers:', sortValue);
    
    // Sort the products
    syntheticProducts = sortProducts(syntheticProducts, sortValue);
    
    let html = '';
    
    for (const product of syntheticProducts) {
        const stockInfo = await getRealProductStockInfo(product.id);
        html += createProductCardHTML(product, stockInfo);
    }
    
    syntheticContainer.innerHTML = html;
    console.log('Synthetic flowers rendered');
}

/**
 * Get real product stock information from server
 */
async function getRealProductStockInfo(productId) {
    try {
        const response = await fetch('./php/api/check-stock.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const stock = data.stock_quantity;
            const minStock = data.min_stock_level;
            const outOfStock = stock === 0;
            const lowStock = stock > 0 && stock <= minStock;
            
            let stockBadge = '';
            let stockDisplay = '';
            
            if (outOfStock) {
                stockBadge = '<div class="stock-badge out-of-stock">Out of Stock</div>';
                stockDisplay = '<div class="stock-display out-of-stock">Currently unavailable</div>';
            } else if (lowStock) {
                stockBadge = '<div class="stock-badge low-stock">Low Stock</div>';
                stockDisplay = `<div class="stock-display low-stock">Only ${stock} left!</div>`;
            } else {
                stockDisplay = `<div class="stock-display in-stock">In Stock (${stock} available)</div>`;
            }
            
            return {
                outOfStock: outOfStock,
                lowStock: lowStock,
                stockBadge: stockBadge,
                stockDisplay: stockDisplay,
                currentStock: stock
            };
        }
    } catch (error) {
        console.error('Error fetching stock info for product', productId, error);
    }
    
    // Fallback if API fails
    return {
        outOfStock: false,
        lowStock: false,
        stockBadge: '',
        stockDisplay: '<div class="stock-display in-stock">In Stock</div>',
        currentStock: 25
    };
}

/**
 * Create product card HTML
 */
function createProductCardHTML(product, stockInfo) {
    const isInWishlist = wishlist.includes(product.id);
    
    return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
        ${product.category === 'best-sellers' ? '<div class="product-badge">Bestseller</div>' : ''}
        ${stockInfo.stockBadge}
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description.substring(0, 80)}...</div>
            <div class="product-price">₱${product.price.toLocaleString()}</div>
            ${stockInfo.stockDisplay}
            <div class="product-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${product.id}" aria-label="Decrease quantity">-</button>
                    <span class="quantity" data-id="${product.id}">1</span>
                    <button class="quantity-btn plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                </div>
                <div class="action-buttons">
                    <button class="add-to-cart" data-id="${product.id}" aria-label="Add to cart" 
                        ${stockInfo.outOfStock ? 'disabled' : ''}>
                        ${stockInfo.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" 
                        data-id="${product.id}" aria-label="Add to wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Update product quantity in UI (before adding to cart)
 */
function updateProductQuantity(productId, isIncrease) {
    const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
    if (!quantityElement) return;
    
    let quantity = parseInt(quantityElement.textContent);
    
    if (isIncrease) {
        quantity++;
    } else if (quantity > 1) {
        quantity--;
    }
    
    quantityElement.textContent = quantity;
}