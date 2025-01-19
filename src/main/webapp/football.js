document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.querySelector(".product-container");
    const navLinks = document.querySelectorAll(".product-nav a"); // Navigation links for categories
    const cart = []; // Initialize the cart array

    // Fetch product data from the JSON file
    fetch("football_products.json")
        .then((response) => response.json())
        .then((products) => {
            // Populate products dynamically
            products.forEach((product) => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.dataset.category = product.category;

                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p class="price">${product.price}</p>
                    <button class="buy-button">Add to cart</button>
                `;

                productContainer.appendChild(productCard);
            });

            // Add event listeners for dynamic content
            initializeCategoryFilter();
            initializeAddToCart(products);
        })
        .catch((error) => console.error("Error fetching product data:", error));

    // Filter products by category
    function initializeCategoryFilter() {
        const productCards = document.querySelectorAll(".product-card");

        navLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent default link behavior

                // Get the category from the clicked link
                const category = link.dataset.category;

                // Show/hide products based on category
                productCards.forEach((card) => {
                    if (category === "All Product" || card.dataset.category.toLowerCase() === category.toLowerCase()) {
                        card.style.display = "block"; // Show the product
                    } else {
                        card.style.display = "none"; // Hide the product
                    }
                });
            });
        });
    }

    // Add to Cart functionality
    function initializeAddToCart(products) {
        const productCards = document.querySelectorAll(".product-card");
        const addToCartButtons = document.querySelectorAll(".buy-button");

        addToCartButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                const productCard = productCards[index];
                const productName = productCard.querySelector("h2").textContent;
                const productPrice = productCard.querySelector(".price").textContent;

                const product = {
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                };

                // Check if product is already in the cart
                const existingProduct = cart.find((item) => item.name === product.name);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push(product);
                }

                console.log("Cart:", cart);

                // Show notification
                showCartNotification("Item added to cart!");
            });
        });
    }

    // Show cart notification
    function showCartNotification(message) {
        const notification = document.getElementById("cart-notification");

        // Update message dynamically
        notification.querySelector(".notification-message").textContent = message;

        // Show the notification
        notification.classList.add("show");

        // Hide the notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
});