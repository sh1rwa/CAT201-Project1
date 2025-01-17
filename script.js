document.addEventListener("DOMContentLoaded", () => {
    const itemGrid = document.getElementById("item-grid");
    const modal = document.getElementById("item-modal");
    const closeModal = document.getElementById("close-modal");
    const modalImage = document.getElementById("modal-image");
    const modalName = document.getElementById("modal-name");
    const modalPrice = document.getElementById("modal-price");
    const modalRating = document.getElementById("modal-rating");
    const modalStock = document.getElementById("modal-stock");
    const addToCartButton = document.getElementById("add-to-cart");

    let selectedItem = null;

    // Fetch and display items
    fetch("items.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const gridItem = document.createElement("div");
                gridItem.className = "grid-item";

                gridItem.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                    <p>⭐ ${item.rating}</p>
                `;

                gridItem.addEventListener("click", () => {
                    selectedItem = item;
                    showModal(item);
                });

                itemGrid.appendChild(gridItem);
            });
        })
        .catch(error => console.error("Error fetching items:", error));

    // Show modal
    function showModal(item) {
        modalImage.src = item.imageUrl;
        modalName.textContent = item.name;
        modalPrice.textContent = `Price: $${item.price.toFixed(2)}`;
        modalRating.textContent = `Rating: ⭐ ${item.rating}`;
        modalStock.textContent = `In stock: ${item.stockQuantity}`;
        modal.classList.remove("hidden");
    }

    // Hide modal
    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Add to cart functionality
    addToCartButton.addEventListener("click", () => {
        if (selectedItem) {
            alert(`${selectedItem.name} has been added to your cart!`);
        }
    });
});
