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
function addToCart(productName, productPrice, productImage) {
    const product = {
      name: productName,
      price: productPrice,
      quantity: 1, // Default quantity
      image: productImage,
    };
  
    cart.push(product);
    document.querySelector(".tt-sliding-cart-trigger-count").textContent = cart.length;
  
    // Update the cart in session storage
    sessionStorage.setItem("cart", JSON.stringify(cart));
  
    // Update the subtotal and cart UI
    updateSubtotal();
    updateCartUI();
  
    // Trigger the cart drawer
    triggerCartDrawer();
  }

  function triggerCartDrawer() {
    const cartTrigger = document.querySelector(".tt-sliding-cart-trigger");
    if (cartTrigger) {
      cartTrigger.click(); // Simulate a click on the cart trigger
    }
  }
  

// Event delegation for dynamically added Add to Cart buttons
document.addEventListener('click', function (event) {
    if (event.target.closest('.tt-product-adc-btn')) {
        event.preventDefault();

        // Perform token validation in the background
        checkToken();

        // Get product details from the clicked button's closest product card
        const productInfo = event.target.closest('.tt-product-info');
        const productName = productInfo.querySelector('.tt-product-title a').innerText;
        const productPrice = parseFloat(productInfo.querySelector('.lzz bdi').textContent.replace(/[^0-9.-]+/g, ""));
        const productImage = event.target.closest('.tt-grid-item').querySelector('.tt-product-image img').getAttribute('src');

        // Add the product to the cart
        addToCart(productName, productPrice, productImage);
    }
});

// Other parts of your code like fetching products and rendering them remain unchanged.


// Add event listeners to "Add to Cart" buttons
document.querySelectorAll('.tt-product-adc-btn').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        // Perform token validation in the background (asynchronous)
        checkToken();

        // Get the product details
        const productInfo = this.closest('.tt-product-info');
        const productName = productInfo.querySelector('.tt-product-title a').innerText;
        const productPrice = parseFloat(productInfo.querySelector('.lzz bdi').textContent.replace(/[^0-9.-]+/g, ""));
        const productImage = this.closest('.tt-grid-item').querySelector('.tt-product-image-holder .tt-product-image img').getAttribute('src');

        // Add the product to the cart
        addToCart(productName, productPrice, productImage);
    });
});

// Event listener for <a> tags with href="z3.html"
document.querySelectorAll('a[href="z3.html"]').forEach(link => {
    link.addEventListener('click', function (event) {
        // Store the cart in session storage before navigating to z3.html
        sessionStorage.setItem('cart', JSON.stringify(cart));
    });
});


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

// Function to update the quantity of a product in the cart
function updateProductQuantity(index, operation) {
    if (operation === 'increase') {
      cart[index].quantity += 1;
    } else if (operation === 'decrease' && cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    }
  
    // Update the subtotal and cart UI
    updateSubtotal();
    updateCartUI();
  }
  
  // Function to update the cart UI
  function updateCartUI() {
    const cartList = document.querySelector(".tt-sliding-cart-product-list");
  
    // Clear the current list
    cartList.innerHTML = "";
  
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
                <div class="tt-scp-variation">Quantity: 
                  <button class="minus" data-index="${index}">-</button>
                  <span class="cart-count">${product.quantity}</span>
                  <button class="plus" data-index="${index}">+</button>
                </div>
              </div>
              <div class="tt-sc-product-quantity-pricing">
                <span class="tt-sc-product-quantity">${product.quantity} x </span>
                <span class="tt-sc-product-price"><bdi>₹${product.price}</bdi></span>
              </div>
              <a href="#" class="tt-sc-product-remove" data-index="${index}" title="Remove">
                <i class="fas fa-times"></i>
              </a>
            </div>
          </div>
        </li>
      `;
  
      // Append the list item to the cart list
      cartList.innerHTML += listItem;
    });
  
    // Add event listeners to "Remove" buttons
    document.querySelectorAll(".tt-sc-product-remove").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const productIndex = this.getAttribute("data-index");
        removeFromCart(productIndex);
      });
    });
  
    // Add event listeners for plus and minus buttons
    document.querySelectorAll('.plus').forEach(button => {
      button.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        updateProductQuantity(index, 'increase');
      });
    });
  
    document.querySelectorAll('.minus').forEach(button => {
      button.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        updateProductQuantity(index, 'decrease');
      });
    });
  }
  
  // Initialize the cart UI and fetch products
  fetchAndRenderProducts();
  

// Function to fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('pujas.json'); // Ensure the path is correct
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
            sizeOptions = product.sizes.map(size => 
                `<option value="${size.price}" data-type="${size.size}">${size.size}</option>`
            ).join('');
            sizeDropdownHTML = `
                <div class="tt-product-options">
                    <label for="size-select-${product.id}">Select Type:</label>
                    <select id="size-select-${product.id}" class="tt-product-dropdown" data-product-id="${product.id}">
                        ${sizeOptions}
                    </select>
                </div>
            `;
            defaultPrice = product.sizes[0].price; 
        }

        productElement.innerHTML = `
            <div class="ttgr-item-inner">
                <div class="tt-product">
                    <div class="tt-product-image-holder">
                        <a href="#" class="tt-product-image-wrap" data-id="${product.id}" data-name="${product.name}" data-image="${product.image}" data-description="${product.description}" data-price="${defaultPrice}">
                            <figure class="tt-product-image">
                                <img class="anim-zoomin tt-lazy" src="${product.image}" data-src="${product.image}" alt="${product.name}" />
                            </figure>
                            <figure class="tt-product-hover-image">
                                <img class="tt-lazy" src="${product.image}" data-src="${product.image}" alt="${product.name}" />
                            </figure>
                        </a>
                    </div>
                    <div class="tt-product-info">
                        <h3 class="tt-product-title">
                            <a href="#" class="tt-product-title-link" data-id="${product.id}" data-name="${product.name}" data-image="${product.image}" data-description="${product.description}" data-price="${defaultPrice}">
                                ${product.name}
                            </a>
                        </h3>
                        ${sizeDropdownHTML}
                        <div class="tt-pi-price-btn-wrap">
                              <div class="lzz">
                                <bdi id="product-price-${product.ID}">₹${defaultPrice}</bdi>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                                
                                 <a  class="tt-product-btn " href="https://wa.me/8792826820">
                                    <span> &nbsp;<i class="fa-brands fa-whatsapp"></i>  Buy Now </span>  
                                </a>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(productElement);
    });

    // Add event listeners to product images and titles for redirection
    document.querySelectorAll('.tt-product-image-wrap, .tt-product-title-link').forEach(element => {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            const image = this.getAttribute('data-image');
            const name = this.getAttribute('data-name');
            const description = this.getAttribute('data-description');
            const selectedSizeDropdown = document.getElementById(`size-select-${this.getAttribute('data-id')}`);
            const selectedOption = selectedSizeDropdown.options[selectedSizeDropdown.selectedIndex];
            const price = selectedOption.value; // Get the price of the selected option
            const sizeType = selectedOption.getAttribute('data-type'); // Get the size type

            // Store the product data in session storage
            const productData = {
                id: this.getAttribute('data-id'),
                name: name,
                image: image,
                description: description,
                price: price, // Use selected price
                sizeType: sizeType // Add size type
            };
            sessionStorage.setItem('selectedProduct', JSON.stringify(productData));

            // Redirect to puja-single.html
            window.location.href = 'puja-single.html';
        });
    });

    // Add event listeners to size dropdowns
    document.querySelectorAll('.tt-product-dropdown').forEach(select => {
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const selectedPrice = selectedOption.value;
            const productElement = this.closest('.tt-product'); // Get the closest product element
            const priceElement = productElement.querySelector('.lzz bdi'); // Find the price within this product
            priceElement.textContent = `₹${selectedPrice}`; // Update the price in the correct product
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
