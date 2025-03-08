// Base URL for the API
const BASE_URL = "http://localhost:8080/item";

// DOM Elements
const addItemForm = document.getElementById("add-item-form");
const itemTableBody = document.querySelector("#item-table tbody");
const searchByIdInput = document.getElementById("search-by-id");
const searchByNameInput = document.getElementById("search-by-name");

// Fetch all items and populate the table
async function fetchItems() {
    try {
        const response = await fetch(`${BASE_URL}/getAll`);
        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }
        const items = await response.json();
        renderItemTable(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch items. Please try again.",
        });
    }
}

// Render item table
function renderItemTable(items) {
    itemTableBody.innerHTML = ""; // Clear the table
    if (items.length === 0) {
        itemTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No items found.</td></tr>`;
        return;
    }
    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.category}</td>
            <td>${item.qty}</td>
            <td><img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>
                <button onclick="editItem(${item.id}, '${item.name}', ${item.price}, '${item.category}', ${item.qty}, '${item.imageUrl}')">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        itemTableBody.appendChild(row);
    });
}

// Add a new item
addItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const item = {
        name: document.getElementById("item-name").value,
        price: parseFloat(document.getElementById("item-price").value),
        category: document.getElementById("item-category").value,
        qty: parseInt(document.getElementById("item-qty").value),
        imageUrl: document.getElementById("item-image-url").value
    };
    try {
        const response = await fetch(`${BASE_URL}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error("Failed to add item");
        }
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Item added successfully!",
        });
        fetchItems(); // Refresh the table after adding an item
        addItemForm.reset();
    } catch (error) {
        console.error("Error adding item:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add item. Please try again.",
        });
    }
});

// Search item by ID
async function searchItemById() {
    const id = searchByIdInput.value.trim();
    if (id) {
        try {
            const response = await fetch(`${BASE_URL}/searchById/${id}`);
            if (!response.ok) {
                throw new Error("Failed to search item");
            }
            const item = await response.json();
            if (item) {
                renderItemTable([item]); // Render single item
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Not Found",
                    text: "Item not found.",
                });
            }
        } catch (error) {
            console.error("Error searching item by ID:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to search item. Please try again.",
            });
        }
    } else {
        fetchItems(); // If search input is empty, fetch all items
    }
}

// Search items by name
async function searchItemsByName() {
    const name = searchByNameInput.value.trim();
    if (name) {
        try {
            const response = await fetch(`${BASE_URL}/searchByName/${name}`);
            if (!response.ok) {
                throw new Error("Failed to search items");
            }
            const items = await response.json();
            renderItemTable(items);
        } catch (error) {
            console.error("Error searching items by name:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to search items. Please try again.",
            });
        }
    } else {
        fetchItems(); // If search input is empty, fetch all items
    }
}

// Edit item (show update form in SweetAlert popup)
function editItem(id, name, price, category, qty, imageUrl) {
    Swal.fire({
        title: "Edit Item",
        html: `
            <input type="text" id="swal-edit-name" class="swal2-input" placeholder="Item Name" value="${name}">
            <input type="number" id="swal-edit-price" class="swal2-input" placeholder="Price" value="${price}" step="0.01">
            <select id="swal-edit-category" class="swal2-input">
                <option value="burger" ${category === "burger" ? "selected" : ""}>Burger</option>
                <option value="submarine" ${category === "submarine" ? "selected" : ""}>Submarine</option>
                <option value="drinks" ${category === "drinks" ? "selected" : ""}>Drinks</option>
                <option value="desserts" ${category === "desserts" ? "selected" : ""}>Desserts</option>
            </select>
            <input type="number" id="swal-edit-qty" class="swal2-input" placeholder="Quantity" value="${qty}">
            <input type="text" id="swal-edit-image-url" class="swal2-input" placeholder="Image URL" value="${imageUrl}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: () => {
            return {
                name: document.getElementById("swal-edit-name").value,
                price: parseFloat(document.getElementById("swal-edit-price").value),
                category: document.getElementById("swal-edit-category").value,
                qty: parseInt(document.getElementById("swal-edit-qty").value),
                imageUrl: document.getElementById("swal-edit-image-url").value
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const updatedItem = result.value;
            try {
                const response = await fetch(`${BASE_URL}/update/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedItem)
                });
                if (!response.ok) {
                    throw new Error("Failed to update item");
                }
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Item updated successfully!",
                });
                fetchItems(); // Refresh the table after updating an item
            } catch (error) {
                console.error("Error updating item:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update item. Please try again.",
                });
            }
        }
    });
}

// Delete item
async function deleteItem(id) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
        try {
            const response = await fetch(`${BASE_URL}/delete/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Item deleted successfully.",
            });
            fetchItems(); // Refresh the table after deleting an item
        } catch (error) {
            console.error("Error deleting item:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete item. Please try again.",
            });
        }
    }
}

// Fetch items on page load
fetchItems();