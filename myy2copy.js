// Array to store the selected products
let cart = [];
let isNotToken = true;

// Function to check the token for authentication
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

// Function to add a product to the cart
function addToCart(productName, productPrice, productImage, size) {
    const product = {
        name: productName,
        price: productPrice,
        quantity: 1,  // Assuming each product has a default quantity of 1
        image: productImage,
        size: size || '' // Add size to the product object, defaulting to an empty string if not provided
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
                            ${product.size ? `<div class="tt-scp-variation">Size: <span>${product.size}</span></div>` : ''}
                            <div class="tt-scp-variation">Quantity: <span>${product.quantity}</span></div>
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

// Function to fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('p2.json'); // Ensure the path is correct
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

function renderProducts(products) {
    const container = document.querySelector('.tt-grid-items-wrap');
    container.innerHTML = ''; // Clear any existing content

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('tt-grid-item');

        let sizeOptions = '';
        let sizeDropdownHTML = '';
        let defaultPrice = product.price || 0; // Default price if size options are not available

        // Check if sizes are available
        if (product.sizes && product.sizes.length > 0) {
            sizeOptions = product.sizes.map(size => `<option value="${size.price}">${size.size}</option>`).join('');
            sizeDropdownHTML = `
                <div class="tt-product-options">
                    <label for="size-select-${product.ID}">Select Size:</label>
                    <select id="size-select-${product.ID}" class="tt-product-dropdown">
                        ${sizeOptions}
                    </select>
                </div>
            `;
            defaultPrice = product.sizes[0].price; // Set default price to the price of the first size
        }

        productElement.innerHTML = `
            <div class="ttgr-item-inner">
                <div class="tt-product">
                    <div class="tt-product-image-holder">
                        <a href="shop-single.html" class="tt-product-image-wrap">
                            <figure class="tt-product-image">
                                <img class="anim-zoomin tt-lazy" src="${product.image}" data-src="${product.image}" alt="${product.name}" />
                            </figure>
                            <figure class="tt-product-hover-image">
                                <img class="tt-lazy" src="${product.image}" data-src="${product.image}" alt="${product.name}" />
                            </figure>

                            <div class="tt-product-additional-buttons">
                                <div class="tt-pr-addit-btn-wrap">
                                    <a href="#" class="tt-pab-btn tt-add-to-wishlist-btn" title="Add to wishlist">
                                        <span><i class="far fa-heart"></i></span>
                                    </a>
                                    <a href="shop-wishlist.html" class="tt-pab-btn tt-add-to-wishlist-btn-active" title="Browse wishlist">
                                        <span><i class="fas fa-heart"></i></span>
                                    </a>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="tt-product-info">
                        <h3 class="tt-product-title">
                            <a href="${product.Link}" title="${product.name}">${product.name}</a>
                        </h3>

                        ${sizeDropdownHTML}

                        <div class="tt-pi-price-btn-wrap">
                            <div class="tt-product-price">
                                <bdi id="product-price-${product.ID}">₹${defaultPrice}</bdi>
                            </div>

                            <div class="tt-product-buttons">
                                <a href="#" class="tt-product-btn tt-product-adc-btn">
                                    <span>Add to Cart</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(productElement);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.tt-product-adc-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            checkToken();
            event.preventDefault();

            // Find the parent product info div
            const productInfo = this.closest('.tt-product-info');

            // Get the product name
            const productName = productInfo.querySelector('.tt-product-title a').innerText;

            // Get the selected price
            const productPrice = parseFloat(productInfo.querySelector('.tt-product-price bdi').textContent.replace(/[^0-9.-]+/g, ""));

            // Get the selected image
            const productImage = this.closest('.tt-grid-item').querySelector('.tt-product-image-holder .tt-product-image img').getAttribute('src');

            // Add product to cart
            addToCart(productName, productPrice, productImage);
        });
    });

    // Add event listeners to size dropdowns
    document.querySelectorAll('.tt-product-dropdown').forEach(select => {
        select.addEventListener('change', function() {
            const selectedPrice = this.value;
            const productId = this.id.split('-').pop(); // Extract the product ID from the select ID
            document.getElementById(`product-price-${productId}`).textContent = `₹${selectedPrice}`;
        });
    });
}



// Combined function to handle fetching, sorting, and filtering
async function fetchAndRenderProducts({ category = null, saleStatus = null, sortOption = null } = {}) {
    let products = await fetchProducts();

    // Filter by category if provided
    if (category) {
        products = products.filter(product => product.Category === category);
    }

    // Filter by sale status if provided
    if (saleStatus) {
        products = products.filter(product => product.sale === saleStatus);
    }

    // Sort products if a sort option is provided
    if (sortOption === 'date') {
        products.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === 'price-incr') {
        products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
    }

    renderProducts(products);
}

// Function to display all products
async function displayAllProducts() {
    fetchAndRenderProducts();
}

// Function to display products by category
function filterProducts(category) {
    fetchAndRenderProducts({ category });
}

// Function to filter products by sale status
function filterBySaleStatus(saleStatus) {
    fetchAndRenderProducts({ saleStatus });
}

// Function to sort products by different options
function sortProducts(sortOption) {
    fetchAndRenderProducts({ sortOption });
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    displayAllProducts();
});