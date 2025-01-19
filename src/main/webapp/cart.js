document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-container");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const jsonFiles = ["equipment.json", "items.json", "another-page-items.json"]; // Add all relevant .json files here

    // Function to fetch items from a specific JSON file
    const fetchItemsData = async (sourceFile) => {
        try {
            const response = await fetch(sourceFile);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${sourceFile}:`, error);
            return [];
        }
    };

    // Function to fetch all relevant items data for the cart
    const fetchAllItemsData = async () => {
        const itemsData = {};
        for (const file of jsonFiles) {
            itemsData[file] = await fetchItemsData(file);
        }
        return itemsData;
    };

    // Display cart items
    async function renderCart() {
        const itemsData = await fetchAllItemsData(); // Fetch all items data
        cartContainer.innerHTML = "";
        let totalPrice = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty!</p>";
            return;
        }

        cart.forEach((item, index) => {
            const itemData = itemsData[item.sourceFile]?.find((data) => data.name === item.name);
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-image">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: 
                    <button class="decrease" data-index="${index}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    ${item.quantity}
                    <button class="increase" data-index="${index}" ${item.quantity >= itemData?.stockQuantity ? 'disabled' : ''}>+</button>
                </p>
                <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                <button class="remove" data-index="${index}">Remove</button>
            `;

            cartContainer.appendChild(cartItem);
        });

        const totalElement = document.createElement("div");
        totalElement.innerHTML = `<h2>Total Price: $${totalPrice.toFixed(2)}</h2>`;
        cartContainer.appendChild(totalElement);
    }

    // Update cart actions
    cartContainer.addEventListener("click", async (e) => {
        const index = e.target.dataset.index;
        const itemsData = await fetchAllItemsData(); // Fetch latest items data

        if (e.target.classList.contains("increase")) {
            const itemData = itemsData[cart[index].sourceFile]?.find((data) => data.name === cart[index].name);
            if (itemData && cart[index].quantity < itemData.stockQuantity) {
                cart[index].quantity += 1;
            }
        } else if (e.target.classList.contains("decrease") && cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else if (e.target.classList.contains("remove")) {
            cart.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
        renderCart();
    });

    // Add to Cart function (to be called from other pages)
    window.addToCart = async (item, sourceFile) => {
        const existingItem = cart.find((cartItem) => cartItem.name === item.name && cartItem.sourceFile === sourceFile);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, sourceFile, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    };

    renderCart();
});