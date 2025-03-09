// Base URLs for the APIs
const ITEM_BASE_URL = "http://localhost:8080/item";
const CUSTOMER_BASE_URL = "http://localhost:8080/customer";
const ORDER_BASE_URL = "http://localhost:8080/order";
const ORDER_DETAILS_BASE_URL = "http://localhost:8080/orderdetails";

// DOM Elements
const menuSections = {
    burgers: document.querySelector("#burgers .menu-cards"),
    submarines: document.querySelector("#submarines .menu-cards"),
    drinks: document.querySelector("#drinks .menu-cards"),
    desserts: document.querySelector("#desserts .menu-cards"),
};
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const customerTpInput = document.getElementById("customer-tp");
const addCustomerPopup = document.getElementById("add-customer-popup");
const addCustomerForm = document.getElementById("add-customer-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Cart Data
let cart = [];

// Fetch all items and populate the menu
async function fetchItems() {
    try {
        const response = await fetch(`${ITEM_BASE_URL}/getAll`);
        if (!response.ok) throw new Error("Failed to fetch items");
        const items = await response.json();
        renderMenu(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch items. Please try again.",
        });
    }
}

// Render menu cards by category
function renderMenu(items) {
    Object.values(menuSections).forEach(section => (section.innerHTML = ""));
    items.forEach(item => {
        const category = item.category.trim().toLowerCase();
        if (menuSections[category]) {
            const card = document.createElement("div");
            card.className = "menu-card";
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            `;
            card.addEventListener("click", () => addToCart(item));
            menuSections[category].appendChild(card);
        }
    });
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    renderCart();
    Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${item.name} has been added to your cart.`,
    });
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Qty: ${item.qty}</p>
            <p>$${(item.price * item.qty).toFixed(2)}</p>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.qty;
    });
    cartTotal.textContent = total.toFixed(2);
}

// Place order
async function placeOrder() {
    const tpNumber = customerTpInput.value.trim();
    if (!tpNumber) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please enter a customer TP number.",
        });
        return;
    }
    if (cart.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Your cart is empty.",
        });
        return;
    }

    try {
        // Step 1: Search for the customer
        const customerResponse = await fetch(`${CUSTOMER_BASE_URL}/searchByTp/${tpNumber}`);
        if (!customerResponse.ok) {
            if (customerResponse.status === 404) {
                // Customer not found, open the popup
                Swal.fire({
                    icon: "info",
                    title: "Customer Not Found",
                    text: "Please add the customer first.",
                });
                openPopup();
                return;
            }
            throw new Error("Failed to search customer");
        }
        const customer = await customerResponse.json();

        // Step 2: Create the order
        const orderId = generateOrderId(); // Generate a unique order ID
        const orderDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

        const orderData = {
            id: orderId,
            date: orderDate,
            customerId: customer.id,
        };

        const orderResponse = await fetch(`${ORDER_BASE_URL}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) throw new Error("Failed to create order");

        // Step 3: Add order details
        for (const item of cart) {
            const orderDetailsData = {
                orderId: orderId,
                itemCode: item.id,
                qty: item.qty,
                unitPrice: item.price,
            };

            const orderDetailsResponse = await fetch(`${ORDER_DETAILS_BASE_URL}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderDetailsData),
            });

            if (!orderDetailsResponse.ok) throw new Error("Failed to add order details");

            // Step 4: Update item quantity in the database
            const updateItemResponse = await fetch(`${ITEM_BASE_URL}/updateQty/${item.id}/${item.qty}`, {
                method: "PUT",
            });

            if (!updateItemResponse.ok) throw new Error("Failed to update item quantity");
        }

        // Step 5: Clear the cart and show success message
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Order placed successfully!",
        });
        cart = [];
        renderCart();
    } catch (error) {
        console.error("Error placing order:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to place order. Please try again.",
        });
    }
}

// Generate a unique order ID (e.g., ODR001, ODR002, etc.)
function generateOrderId() {
    return `ODR${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
}

// Add new customer
addCustomerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const customer = {
        name: document.getElementById("customer-name").value,
        tpNumber: document.getElementById("customer-tp").value
    };
    try {
        const response = await fetch(`${CUSTOMER_BASE_URL}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        });
        if (!response.ok) throw new Error("Failed to add customer");
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Customer added successfully!",
        });
        closePopup();
    } catch (error) {
        console.error("Error adding customer:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add customer. Please try again.",
        });
    }
});

// Open add customer popup
function openPopup() {
    addCustomerPopup.classList.add("active");
}

// Close add customer popup
function closePopup() {
    addCustomerPopup.classList.remove("active");
    addCustomerForm.reset();
}

// Auto-load search results as the user types
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
        searchResults.innerHTML = ""; // Clear results if the search bar is empty
        return;
    }

    try {
        const response = await fetch(`${ITEM_BASE_URL}/searchByName/${query}`);
        if (!response.ok) throw new Error("Failed to search items");
        const items = await response.json();
        displaySearchResults(items);
    } catch (error) {
        console.error("Error searching items by name:", error);
        searchResults.innerHTML = "<p>No items found.</p>";
    }
});

// Display Search Results
function displaySearchResults(items) {
    searchResults.innerHTML = items.map(item => `
        <div class="menu-card" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150'">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
        </div>
    `).join("");

    // Add click event listeners to search result cards
    const searchCards = document.querySelectorAll(".search-results .menu-card");
    searchCards.forEach(card => {
        card.addEventListener("click", () => {
            const itemId = card.getAttribute("data-id");
            const item = items.find(item => item.id == itemId);
            addToCart(item);
        });
    });
}

// Fetch items on page load
fetchItems();