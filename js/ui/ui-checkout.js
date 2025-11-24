/**
 * Checkout UI Management
 * Handles checkout process, form validation, and order processing
 */

/**
 * Initialize checkout functionality
 */
function initCheckout() {
    setupRealTimeValidation();
}

/**
 * Setup real-time form validation
 */
function setupRealTimeValidation() {
    const formInputs = checkoutForm.querySelectorAll('input, select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

/**
 * Populate order summary in checkout
 */
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

/**
 * Handle checkout form submission
 */
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

/**
 * Process the order
 */
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

/**
 * Reset checkout form
 */
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

/**
 * Proceed to checkout
 */
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