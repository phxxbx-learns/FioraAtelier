/**
 * Cart UI Management
 * Handles all cart-related user interface operations
 */

/**
 * Update cart UI with current cart state
 */
function updateCartUI() {
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

/**
 * Add product to cart with error handling
 */
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

/**
 * Remove product from cart
 */
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

/**
 * Update cart item quantity
 */
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

/**
 * Reset product quantity in product card
 */
function resetProductQuantity(productId) {
    const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
    quantityElement.textContent = '1';
}

/**
 * Undo last cart action
 */
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