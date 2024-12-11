let isNotToken=true;

async function checkToken() {
    if (typeof isNotToken !== 'undefined' && isNotToken === true) {

        try {

            const token = localStorage.getItem('authenticationToken');

            const response = await fetch("http://www.api.vajranakha.org/checkToken", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'loginauthorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {

                isNotToken = false;

            } else {
                alert("Not logged in");
                window.location.href = "shop-login.html";
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    }
}


// Function to load cart data from session storage and update the table
function loadCartFromSession() {

    checkToken();

    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
        const cart = JSON.parse(cartData);
        const tbody = document.querySelector('.shop-cart-table-body');
        tbody.innerHTML = '';  // Clear existing rows

        cart.forEach(product => {
            // Create a new table row
            const row = document.createElement('tr');
            row.className = 'shop-cart-table-item';
            
            row.innerHTML = `
                <td class="cti-product-remove"> 
                    <a href="#" title="Remove this item" data-name="${product.name}" class="remove-item"><i class="fas fa-times"></i></a>
                </td>
                <td class="cti-product-thumb">
                    <a href="shop-single.html">
                        <img src="${product.image}" alt="image">
                    </a>
                </td>
                <td class="cti-product-title">
                    <div class="cti-product-title-inner">
                        <a href="shop-single.html">${product.name}</a>
                        <div class="cti-product-variations">
                            <div class="ctip-variation">Product <span>${product.quantity}</span></div>
                        </div>
                    </div>
                </td>
                <td class="cti-price" data-title="Price">
                    <bdi>₹${product.price.toFixed(2)}</bdi>
                </td>
                <td class="cti-quantity" data-title="Quantity">
                    <div class="single-product-quantity hide-cursor" title="Quantity">
                        <div class="qtybutton inc">+</div>
                        <input type="number" value="${product.quantity}" class="cart-plus-minus-box" step="1" min="1" name="quantity" data-name="${product.name}">
                        <div class="qtybutton dec">-</div>
                    </div>
                </td>
                <td class="cti-subtotal" data-title="Subtotal">
                    <bdi>₹${(product.price * product.quantity).toFixed(2)}</bdi>
                </td>
            `;

            tbody.appendChild(row);
        });

        // Update total price
        updateCartTotal();
    }
}

// Function to update the total price
function updateCartTotal() {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
        const cart = JSON.parse(cartData);
        let total = 0;
        cart.forEach(product => {
            total += product.price * product.quantity;
        });
        const subtotalElement = document.querySelector('.sc-totals-subtotal bdi');
        subtotalElement.innerText = `₹${total.toFixed(2)}`;
        document.querySelector('.sc-totals-total bdi').innerText = `₹${total.toFixed(2)}`; 
    }
}

// Event delegation for removing items
document.querySelector('.shop-cart-table-body').addEventListener('click', function(event) {
    if (event.target.closest('.remove-item')) {
        event.preventDefault();
        const productName = event.target.closest('.remove-item').getAttribute('data-name');
        removeFromCart(productName);
        loadCartFromSession(); // Reload the cart after removal
    }
});

// Function to remove a product from the cart
function removeFromCart(name) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.name !== name);
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Event delegation for quantity changes
document.querySelector('.shop-cart-table-body').addEventListener('click', function(event) {
    if (event.target.classList.contains('qtybutton')) {
        event.preventDefault();
        const input = event.target.parentElement.querySelector('input.cart-plus-minus-box');
        const name = input.getAttribute('data-name');
        let quantity = parseInt(input.value, 10);

        if (event.target.classList.contains('inc')) {
            quantity += 1;
        } else if (event.target.classList.contains('dec')) {
            quantity = Math.max(quantity - 1, 1);  // Prevent quantity from going below 1
        }

        updateCartQuantity(name, quantity);
    }
});

// Function to update quantity and price in the cart
function updateCartQuantity(name, newQuantity) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.map(product => {
        if (product.name === name) {
            product.quantity = newQuantity;
        }
        return product;
    });
    sessionStorage.setItem('cart', JSON.stringify(cart));
    loadCartFromSession(); // Reload the cart after updating quantity
}

// Load the cart data on page load
loadCartFromSession();