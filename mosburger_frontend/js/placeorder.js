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
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Qty: ${item.qty}</p>
            <p>$${(item.price * item.qty).toFixed(2)}</p>
            <div class="actions">
                <button class="delete-btn" data-index="${index}">Delete</button>
                <button class="increase-btn" data-index="${index}">Increase Qty</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.qty;
    });
    cartTotal.textContent = total.toFixed(2);

    // Add event listeners for delete and increase buttons
    addEventListenersToButtons();
}

// Add event listeners to delete and increase buttons
function addEventListenersToButtons() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const increaseButtons = document.querySelectorAll(".increase-btn");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            deleteCartItem(index);
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            increaseQuantity(index);
        });
    });
}

// Delete a cart item
function deleteCartItem(index) {
    cart.splice(index, 1); // Remove the item from the cart
    renderCart(); // Re-render the cart
}

// Increase the quantity of a cart item
function increaseQuantity(index) {
    cart[index].qty += 1; // Increase the quantity
    renderCart(); // Re-render the cart
}

// Generate Order ID: Fetch the last order ID and increment it by 1
async function generateOrderId() {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/lastOrderId`);
        if (!response.ok) throw new Error("Failed to fetch last order ID");
        const lastOrderId = await response.text(); // Use response.text() instead of response.json()
        const newOrderId = `ODR${String(parseInt(lastOrderId.replace("ODR", "")) + 1).padStart(3, "0")}`;
        return newOrderId;
    } catch (error) {
        console.error("Error generating order ID:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to generate order ID. Please try again.",
        });
        throw error;
    }
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

        // Step 2: Generate a new order ID
        const orderId = await generateOrderId();
        const orderDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

        // Step 3: Create the order
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

        // Step 4: Add order details
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

            // Step 5: Update item quantity in the database
            const updateItemResponse = await fetch(`${ITEM_BASE_URL}/updateQty/${item.id}/${item.qty}`, {
                method: "PUT",
            });

            if (!updateItemResponse.ok) throw new Error("Failed to update item quantity");
        }

        // Step 6: Show success message and print the bill
        printBill(orderId, customer, [...cart]);
        Swal.fire({
            
            icon: "success",
            title: "Success",
            text: "Order placed successfully!",
        }).then(() => {
            console.log("Cart Data:", cart);
            console.log("Customer Data:", customer);
            console.log("Order ID:", orderId);
        });

        // Step 7: Clear the cart and update the UI
        fetchAndDisplayOrderDetails();
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


// Function to print the bill
function printBill(orderId, customer, cart) {
    // Create a new window for the bill
    const billWindow = window.open("", "_blank");

    // Calculate the total amount
    const totalAmount = cart.reduce((total, item) => total + item.qty * item.price, 0);

    // Generate the bill content
    const billContent = `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Bill - #${orderId}</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #333;">
    <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header Section -->
        <div style="background: #4a6fa5; color: white; padding: 20px; text-align: center; position: relative;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Order Bill</h1>
            <div style="background: #fff; color: #4a6fa5; font-weight: bold; padding: 5px 10px; border-radius: 20px; display: inline-block; margin-top: 10px; font-size: 14px;">Order ID: #${orderId}</div>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 25px;">
            <!-- Customer Details -->
            <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px dashed #e1e1e1;">
                <p style="margin: 8px 0; font-size: 15px; display: flex; justify-content: space-between;">
                    <strong style="color: #4a6fa5;">Customer Name:</strong> <span>${customer.name}</span>
                </p>
                <p style="margin: 8px 0; font-size: 15px; display: flex; justify-content: space-between;">
                    <strong style="color: #4a6fa5;">Customer TP:</strong> <span>${customer.tpNumber}</span>
                </p>
                <p style="margin: 8px 0; font-size: 15px; display: flex; justify-content: space-between;">
                    <strong style="color: #4a6fa5;">Order Date:</strong> <span>${new Date().toLocaleDateString()}</span>
                </p>
            </div>
            
            <!-- Order Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border-radius: 5px; overflow: hidden;">
                <thead>
                    <tr>
                        <th style="background-color: #f2f5fa; color: #4a6fa5; padding: 12px; text-align: left; font-weight: 600; min-width: 120px;">Item</th>
                        <th style="background-color: #f2f5fa; color: #4a6fa5; padding: 12px; text-align: left; font-weight: 600;">Quantity</th>
                        <th style="background-color: #f2f5fa; color: #4a6fa5; padding: 12px; text-align: left; font-weight: 600;">Unit Price</th>
                        <th style="background-color: #f2f5fa; color: #4a6fa5; padding: 12px; text-align: left; font-weight: 600;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #f2f2f2;">${item.name}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #f2f2f2;">${item.qty}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #f2f2f2;">$${item.price.toFixed(2)}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #f2f2f2; font-weight: 600;">$${(item.qty * item.price).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <!-- Total Section -->
            <div style="background-color: #f2f5fa; padding: 15px; border-radius: 5px; text-align: right;">
                <p style="margin: 5px 0; font-size: 18px; color: #4a6fa5;">
                    <strong>Total Amount:</strong> <span style="font-weight: 600;">$${totalAmount.toFixed(2)}</span>
                </p>
            </div>
            
            <!-- Footer Section -->
            <div style="margin-top: 25px; text-align: center; color: #888; font-size: 14px;">
                <p style="margin: 5px 0;">Thank you for your purchase!</p>
                <p style="margin: 5px 0;">Please keep this bill for your reference.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // Write the bill content to the new window
    billWindow.document.write(billContent);
    billWindow.document.close();

    // Trigger the print dialog
    billWindow.print();
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






const orderDetailsTableBody = document.querySelector("#order-details-table tbody");
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");

// Fetch and display all order details
async function fetchAndDisplayOrderDetails() {
    try {
        const response = await fetch(`${ORDER_DETAILS_BASE_URL}/all`);
        if (!response.ok) throw new Error("Failed to fetch order details");
        const orderDetails = await response.json();
        renderOrderDetails(orderDetails);
    } catch (error) {
        console.error("Error fetching order details:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to fetch order details. Please try again.",
        });
    }
}

// Render order details in the table
function renderOrderDetails(orderDetails) {
    orderDetailsTableBody.innerHTML = ""; // Clear existing rows

    orderDetails.forEach(detail => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${detail.id}</td>
            <td>${detail.itemCode}</td>
            <td>${detail.qty}</td>
            <td>$${detail.unitPrice.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit" onclick="openEditModal('${detail.id}', '${detail.itemCode}', ${detail.qty}, ${detail.unitPrice})">Edit</button>
                    <button class="delete" onclick="deleteOrderDetail('${detail.id}', '${detail.itemCode}')">Delete</button>
                </div>
            </td>
        `;
        orderDetailsTableBody.appendChild(row);
    });
}

// Open edit modal
function openEditModal(orderId, itemCode, qty, unitPrice) {
    document.getElementById("edit-order-id").value = orderId;
    document.getElementById("edit-item-code").value = itemCode;
    document.getElementById("edit-qty").value = qty;
    document.getElementById("edit-unit-price").value = unitPrice;
    editModal.style.display = "flex";
}

// Close edit modal
function closeEditModal() {
    editModal.style.display = "none";
}

// Submit edit form
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const orderId = document.getElementById("edit-order-id").value;
    const itemCode = document.getElementById("edit-item-code").value;
    const qty = parseInt(document.getElementById("edit-qty").value);
    const unitPrice = parseFloat(document.getElementById("edit-unit-price").value);

    try {
        const response = await fetch(`${ORDER_DETAILS_BASE_URL}/update/${orderId}/${itemCode}?qty=${qty}&unitPrice=${unitPrice}`, {
            method: "PUT",
        });

        if (!response.ok) throw new Error("Failed to update order detail");

        Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Order detail updated successfully!",
        });

        closeEditModal();
        fetchAndDisplayOrderDetails(); // Refresh the table
    } catch (error) {
        console.error("Error updating order detail:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to update order detail. Please try again.",
        });
    }
});

// Delete order detail
async function deleteOrderDetail(orderId, itemCode) {
    Swal.fire({
        title: `Are you sure?`,
        text: `You are about to delete Order ID: ${orderId}, Item Code: ${itemCode}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${ORDER_DETAILS_BASE_URL}/delete/${orderId}/${itemCode}`, {
                    method: "DELETE",
                });

                if (!response.ok) throw new Error("Failed to delete order detail");

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Order detail deleted successfully!",
                });

                fetchAndDisplayOrderDetails(); // Refresh the table
            } catch (error) {
                console.error("Error deleting order detail:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to delete order detail. Please try again.",
                });
            }
        }
    });
}

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// Fetch order details on page load
fetchAndDisplayOrderDetails();


// Constants
const searchOrderIdInput = document.getElementById("search-order-id");
const searchItemCodeInput = document.getElementById("search-item-code");

// Function to fetch and display all order details
async function fetchAllOrderDetails() {
    try {
        const response = await fetch(`${ORDER_DETAILS_BASE_URL}/all`);
        if (!response.ok) throw new Error("Failed to fetch all order details");

        const orderDetails = await response.json();

        // Clear the table before rendering new data
        orderDetailsTableBody.innerHTML = "";

        if (orderDetails.length > 0) {
            orderDetails.forEach(orderDetail => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${orderDetail.id}</td>
                    <td>${orderDetail.itemCode}</td>
                    <td>${orderDetail.qty}</td>
                    <td>$${orderDetail.unitPrice.toFixed(2)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit" onclick="openEditModal('${orderDetail.id}', '${orderDetail.itemCode}', ${orderDetail.qty}, ${orderDetail.unitPrice})">Edit</button>
                            <button class="delete" onclick="deleteOrderDetail('${orderDetail.id}', '${orderDetail.itemCode}')">Delete</button>
                        </div>
                    </td>
                `;
                orderDetailsTableBody.appendChild(row);
            });
        } else {
            orderDetailsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No order details available.</td></tr>`;
        }
    } catch (error) {
        console.error("Error fetching all order details:", error);
        orderDetailsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Failed to load order details. Please try again.</td></tr>`;
    }
}

// Function to fetch and display search results
async function searchOrderDetails(orderId, itemCode) {
    try {
        const response = await fetch(`${ORDER_DETAILS_BASE_URL}/search/${orderId}/${itemCode}`);
        if (!response.ok) throw new Error("Failed to fetch order details");

        const orderDetail = await response.json();

        // Clear the table and render the single result
        orderDetailsTableBody.innerHTML = "";
        if (orderDetail) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${orderDetail.id}</td>
                <td>${orderDetail.itemCode}</td>
                <td>${orderDetail.qty}</td>
                <td>$${orderDetail.unitPrice.toFixed(2)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit" onclick="openEditModal('${orderDetail.id}', '${orderDetail.itemCode}', ${orderDetail.qty}, ${orderDetail.unitPrice})">Edit</button>
                        <button class="delete" onclick="deleteOrderDetail('${orderDetail.id}', '${orderDetail.itemCode}')">Delete</button>
                    </div>
                </td>
            `;
            orderDetailsTableBody.appendChild(row);
        } else {
            orderDetailsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No order details found for the given search criteria.</td></tr>`;
        }
    } catch (error) {
        console.error("Error searching order details:", error);
        orderDetailsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Failed to search order details. Please try again.</td></tr>`;
    }
}

// Function to handle input changes
function handleSearchInput() {
    const orderId = searchOrderIdInput.value.trim();
    const itemCode = searchItemCodeInput.value.trim();

    if (orderId && itemCode) {
        searchOrderDetails(orderId, itemCode);
    } else {
        // If both fields are empty, fetch all order details
        fetchAllOrderDetails();
    }
}

// Add event listeners for input changes
searchOrderIdInput.addEventListener("input", handleSearchInput);
searchItemCodeInput.addEventListener("input", handleSearchInput);

// Fetch all order details on page load
fetchAllOrderDetails();
