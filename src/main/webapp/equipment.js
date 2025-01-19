document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".product-nav a"); // Select all navigation links
    const productContainer = document.querySelector(".product-container"); // Container for products
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage

    // Fetch products from the JSON file
    fetch("equipment_products.json")
        .then((response) => response.json())
        .then((products) => {
            renderProducts(products); // Render products on the page

            // Add event listeners for navigation links
            navLinks.forEach((link) => {
                link.addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent default link behavior

                    const category = link.dataset.category;
                    filterProducts(products, category); // Filter products by category
                });
            });

            // Add event listeners for "Add to Cart" buttons
            productContainer.addEventListener("click", (event) => {
                if (event.target.classList.contains("buy-button")) {
                    const productIndex = event.target.dataset.index; // Get product index
                    const product = products[productIndex]; // Find product from JSON data

                    addToCart(product, "equipment_products.json"); // Add product to cart with source
                    showCartNotification("Item added to cart!");
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });

    // Function to render products on the page
    function renderProducts(products) {
        productContainer.innerHTML = ""; // Clear existing products
        products.forEach((product, index) => {
            const productCard = `
                <div class="product-card" data-category="${product.category}">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p class="price">${product.price}</p>
                    <button class="buy-button" data-index="${index}">Add to cart</button>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    }

    // Function to filter products by category
    function filterProducts(products, category) {
        const filteredProducts =
            category === "All Product"
                ? products
                : products.filter((product) =>
                      product.category.toLowerCase() === category.toLowerCase()
                  );
        renderProducts(filteredProducts); // Re-render products
    }

    // Function to add product to the cart
    function addToCart(product, sourceFile) {
        const existingProduct = cart.find(
            (item) => item.name === product.name && item.sourceFile === sourceFile
        );
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1, sourceFile });
        }
        localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to localStorage
        console.log("Cart:", cart);
    }

    // Function to show cart notification
    function showCartNotification(message) {
        const notification = document.getElementById("cart-notification");
        document.querySelector(".notification-message").textContent = message;
        notification.classList.add("show");
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
});