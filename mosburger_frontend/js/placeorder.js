// Base URLs for the APIs
const ITEM_BASE_URL = "http://localhost:8080/item";
const CUSTOMER_BASE_URL = "http://localhost:8080/customer";

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

// Cart Data
let cart = [];

// Fetch all items and populate the menu
async function fetchItems() {
    try {
        const response = await fetch(`${ITEM_BASE_URL}/getAll`);
        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }
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
    // Clear all menu sections
    Object.values(menuSections).forEach(section => (section.innerHTML = ""));

    items.forEach(item => {
        // Normalize the category: trim whitespace, convert to lowercase, and map to the correct key
        let category = item.category.trim().toLowerCase();

        // Map "burger" to "burgers" and "submarine" to "submarines"
        if (category === "burger") {
            category = "burgers";
        } else if (category === "submarine") {
            category = "submarines";
        }

        // Check if the category exists in menuSections
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
        } else {
            console.warn(`Invalid category: ${item.category}`);
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
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = ""; // Clear the cart
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
        const response = await fetch(`${CUSTOMER_BASE_URL}/searchByTp/${tpNumber}`);
        if (!response.ok) {
            if (response.status === 404) {
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
        const customer = await response.json();
        // Place order logic here (e.g., send order to backend)
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Order placed successfully!",
        });
        cart = []; // Clear the cart
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
        if (!response.ok) {
            throw new Error("Failed to add customer");
        }
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

// Fetch items on page load
fetchItems();

// Open add customer popup
function openPopup() {
    addCustomerPopup.classList.add("active");
}

// Close add customer popup
function closePopup() {
    addCustomerPopup.classList.remove("active");
    addCustomerForm.reset();
}

// DOM Elements for Search
const searchInput = document.getElementById("search-input");
const searchByIdButton = document.getElementById("search-by-id");
const searchByNameButton = document.getElementById("search-by-name");
const searchResults = document.getElementById("search-results");

// Search by ID
searchByIdButton.addEventListener("click", async () => {
    const id = searchInput.value.trim();
    if (!id) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please enter an ID.",
        });
        return;
    }
    try {
        const response = await fetch(`${ITEM_BASE_URL}/searchById/${id}`);
        if (!response.ok) throw new Error("Item not found");
        const item = await response.json();
        displaySearchResults([item]);
    } catch (error) {
        console.error("Error searching item by ID:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Item not found.",
        });
        searchResults.innerHTML = "<p>Item not found.</p>";
    }
});

// Search by Name
searchByNameButton.addEventListener("click", async () => {
    const name = searchInput.value.trim();
    if (!name) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please enter a name.",
        });
        return;
    }
    try {
        const response = await fetch(`${ITEM_BASE_URL}/searchByName/${name}`);
        if (!response.ok) throw new Error("Failed to search items");
        const items = await response.json();
        displaySearchResults(items);
    } catch (error) {
        console.error("Error searching items by name:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No items found.",
        });
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


// Auto-load search results as the user types
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
        searchResults.innerHTML = ""; // Clear results if the search bar is empty
        return;
    }

    try {
        // Search by name as the user types
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