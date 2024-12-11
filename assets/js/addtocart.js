// Array to store the selected products
let cart = [];
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

// Function to calculate and update the subtotal
function updateSubtotal() {
    let subtotal = 0;

    // Calculate the total price of all products in the cart
    cart.forEach(product => {
        subtotal += product.price * product.quantity;
    });

    console.log("cart", cart);

    // Update the subtotal in the DOM
    const subtotalElement = document.querySelector('.tt-sliding-cart-total bdi');
    subtotalElement.innerText = `₹${subtotal.toFixed(2)}`;
}

// Function to add product to cart
function addToCart(productName, productPrice, productImage) {
    const product = {
        name: productName,
        price: productPrice,
        quantity: 1,  // Assuming each product has a default quantity of 1
        image: productImage
    };
    cart.push(product);
    document.querySelector(".tt-sliding-cart-trigger-count").textContent = cart.length;
    // Update the subtotal after updating the cart UI
    updateSubtotal();
    updateCartUI();
}

// Function to remove a product from the cart array and update the UI
function removeFromCart(index) {
    // Remove the product from the cart array based on the index
    cart.splice(index, 1);
    document.querySelector(".tt-sliding-cart-trigger-count").textContent = cart.length;
    // Update the subtotal after updating the cart UI
    updateSubtotal();
    // Update the UI after removing the product
    updateCartUI();
}

// Function to update the cart UI
function updateCartUI() {
    const cartList = document.querySelector('.tt-sliding-cart-product-list');
    
    // Clear the current list
    cartList.innerHTML = '';

    // Loop through the cart array and create new list items
    cart.forEach((product, index) => {
        const listItem = `
            <li>
                <div class="tt-sliding-cart-product">
                    <a href="shop-single.html" class="tt-sc-product-thumb">
                        <img src=${product.image} alt="image">
                    </a>
                    <div class="tt-sc-product-info">
                        <a href="shop-single.html" class="tt-sc-product-title">${product.name}</a>
                        <div class="tt-sc-product-variations">
                            <div class="tt-scp-variation">Product <span>${product.quantity}</span></div>
                        </div>
                        <div class="tt-sc-product-quantity-pricing">
                            <span class="tt-sc-product-quantity">${product.quantity} x </span>
                            <span class="tt-sc-product-price"><bdi>₹${product.price}</bdi></span>
                        </div>
                        <a href="#" class="tt-sc-product-remove" data-index="${index}" title="Remove"><i class="fas fa-times"></i></a>
                    </div>
                </div>
            </li>
        `;
        
        // Append the list item to the cart list
        cartList.innerHTML += listItem;
    });

    // Add event listeners to all "Remove" buttons
    document.querySelectorAll('.tt-sc-product-remove').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            // Get the index of the product to remove (stored in the data-index attribute)
            const productIndex = this.getAttribute('data-index');

            // Remove the product from the cart
            removeFromCart(productIndex);
        });
    });
}

// Add event listeners to "Add to Cart" buttons
document.querySelectorAll('.tt-product-adc-btn').forEach(button => {
    button.addEventListener('click', function (event) {

        checkToken();
        console.log(isNotToken);

        event.preventDefault();

        // Find the parent product info div
        const productInfo = this.closest('.tt-product-info');

        // Get the product name
        const productName = productInfo.querySelector('.tt-product-title a').innerText;

        // Get the product price
        const productPrice = parseFloat(productInfo.querySelector('.tt-product-price bdi').textContent.replace(/[^0-9.-]+/g, ""));

        const productImage =  this.closest('.tt-grid-item').querySelector('.tt-product-image-holder .tt-product-image img').getAttribute('src');

        // Add product to cart
        addToCart(productName, productPrice, productImage);
    });
});

// Add event listener to <a> tags with href="z3.html"
document.querySelectorAll('a[href="z3.html"]').forEach(link => {
    link.addEventListener('click', function(event) {
        // Store the cart in session storage before navigating to z3.html
        sessionStorage.setItem('cart', JSON.stringify(cart));
    });
});
