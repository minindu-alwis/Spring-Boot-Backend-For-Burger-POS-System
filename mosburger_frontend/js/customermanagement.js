// Base URL for the API
const BASE_URL = "http://localhost:8080/customer";

// DOM Elements
const addCustomerForm = document.getElementById("add-customer-form");
const updateCustomerForm = document.getElementById("update-customer-form");
const customerTableBody = document.querySelector("#customer-table tbody");
const updateFormContainer = document.querySelector(".update-form");
const cancelUpdateButton = document.getElementById("cancel-update");
const searchInput = document.getElementById("search-tp");

// Fetch all customers and populate the table
async function fetchCustomers() {
    try {
        const response = await fetch(`${BASE_URL}/getAll`);
        const customers = await response.json();
        renderCustomerTable(customers);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch customers. Please try again.",
        });
    }
}

// Render customer table
function renderCustomerTable(customers) {
    customerTableBody.innerHTML = ""; // Clear the table
    customers.forEach(customer => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.tpNumber}</td>
            <td>
                <button onclick="editCustomer(${customer.id}, '${customer.name}', '${customer.tpNumber}')">Edit</button>
                <button onclick="deleteCustomer('${customer.tpNumber}')">Delete</button>
            </td>
        `;
        customerTableBody.appendChild(row);
    });
}

// Add a new customer
addCustomerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const customer = {
        name: document.getElementById("customer-name").value,
        tpNumber: document.getElementById("customer-tp").value
    };
    try {
        const response = await fetch(`${BASE_URL}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        });
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Customer added successfully!",
            });
            fetchCustomers();
            addCustomerForm.reset();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add customer.",
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add customer. Please try again.",
        });
    }
});

// Delete a customer
async function deleteCustomer(tpNumber) {
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
            const response = await fetch(`${BASE_URL}/deleteByTp/${tpNumber}`, {
                method: "DELETE"
            });
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Customer deleted successfully.",
                });
                fetchCustomers();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete customer.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete customer. Please try again.",
            });
        }
    }
}

// Edit a customer (show update form in SweetAlert popup)
function editCustomer(id, name, tpNumber) {
    Swal.fire({
        title: "Edit Customer",
        html: `
            <input type="text" id="swal-update-name" class="swal2-input" placeholder="Customer Name" value="${name}">
            <input type="text" id="swal-update-tp" class="swal2-input" placeholder="TP Number" value="${tpNumber}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: () => {
            return {
                name: document.getElementById("swal-update-name").value,
                tpNumber: document.getElementById("swal-update-tp").value
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const updatedCustomer = {
                id: id,
                name: result.value.name,
                tpNumber: result.value.tpNumber
            };
            try {
                const response = await fetch(`${BASE_URL}/update/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedCustomer)
                });
                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Customer updated successfully!",
                    });
                    fetchCustomers();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to update customer.",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update customer. Please try again.",
                });
            }
        }
    });
}

// Search customer by TP number
async function searchCustomer() {
    const tpNumber = searchInput.value.trim();
    if (tpNumber) {
        try {
            const response = await fetch(`${BASE_URL}/searchByTp/${tpNumber}`);
            if (response.ok) {
                const customer = await response.json();
                if (customer) {
                    renderCustomerTable([customer]); // Render single customer
                } else {
                    Swal.fire({
                        icon: "info",
                        title: "Not Found",
                        text: "Customer not found.",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to search customer.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to search customer. Please try again.",
            });
        }
    } else {
        fetchCustomers(); // If search input is empty, fetch all customers
    }
}

// Fetch customers on page load
fetchCustomers();