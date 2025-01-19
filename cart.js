document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-container");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Fetch the items data (simulating a fetch from items.json)
    const fetchItemsData = async () => {
        try {
            const response = await fetch("items.json"); // Replace with the actual path to your items.json
            return await response.json();
        } catch (error) {
            console.error("Error fetching items data:", error);
            return [];
        }
    };

    // Display cart items
    async function renderCart() {
        const itemsData = await fetchItemsData(); // Get the updated items data

        cartContainer.innerHTML = "";
        let totalPrice = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty!</p>";
            return;
        }

        cart.forEach((item, index) => {
            const itemData = itemsData.find((data) => data.name === item.name);
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
                    <button class="increase" data-index="${index}" ${item.quantity >= itemData.stockQuantity ? 'disabled' : ''}>+</button>
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
        const itemsData = await fetchItemsData(); // Get the latest items data

        if (e.target.classList.contains("increase")) {
            const itemData = itemsData.find((data) => data.name === cart[index].name);
            if (cart[index].quantity < itemData.stockQuantity) {
                cart[index].quantity += 1;
                itemData.stockQuantity -= 1;  // Decrease stock
            }
        } else if (e.target.classList.contains("decrease") && cart[index].quantity > 1) {
            const itemData = itemsData.find((data) => data.name === cart[index].name);
            cart[index].quantity -= 1;
            itemData.stockQuantity += 1;  // Increase stock
        } else if (e.target.classList.contains("remove")) {
            const itemData = itemsData.find((data) => data.name === cart[index].name);
            itemData.stockQuantity += cart[index].quantity;  // Return all stock
            cart.splice(index, 1);
        }

        // Save the updated stock back to itemsData and update localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        await updateItemsData(itemsData);  // Assuming you want to persist this data back to a server or localStorage

        renderCart();
    });

    // Function to simulate updating the items data (could save to backend)
    async function updateItemsData(itemsData) {
        try {
            const response = await fetch("update-items.json", {
                method: "POST",  // Assuming you're posting back to a server
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(itemsData)
            });
            return await response.json();
        } catch (error) {
            console.error("Error updating items data:", error);
        }
    }

    renderCart();
});

// this is the end