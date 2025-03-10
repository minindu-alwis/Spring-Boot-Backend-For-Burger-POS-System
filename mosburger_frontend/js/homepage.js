document.querySelector(".customer-report").addEventListener("click", async () => {
    try {
        // Fetch customer data
        const customerResponse = await fetch("http://localhost:8080/customer/getAll");
        if (!customerResponse.ok) throw new Error("Failed to fetch customer data");
        const customers = await customerResponse.json();

        // Fetch order details
        const orderResponse = await fetch("http://localhost:8080/orderdetails/all");
        if (!orderResponse.ok) throw new Error("Failed to fetch order details");
        const orders = await orderResponse.json();

        // Merge data: Group orders by customer
        const customerOrders = customers.map(customer => {
            const customerOrders = orders.filter(order => order.customerId === String(customer.id));
            const totalSpent = customerOrders.reduce((sum, order) => sum + (order.qty * order.unitPrice), 0);
            return { ...customer, orders: customerOrders, totalSpent };
        });

        if (!customerOrders.length) {
            alert("No data found!");
            return;
        }

        // Generate the report
        const reportHTML = `
            <html>
            <head>
                <title>Customer Order Report</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body { font-family: 'Poppins', sans-serif; text-align: center; background: #f4f4f4; padding: 20px; }
                    h1 { color: #333; }
                    .chart-container { width: 80%; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
                    table { width: 90%; margin: 20px auto; border-collapse: collapse; background: white; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    th { background: #ff7e5f; color: white; }
                    .order-row { background: #f9f9f9; }
                    button { padding: 10px 20px; margin: 20px; border: none; border-radius: 5px; cursor: pointer; background: #007bff; color: white; font-size: 16px; }
                    button:hover { background: #0056b3; }
                </style>
            </head>
            <body>
                <h1>Customer Order Report</h1>
                <div class="chart-container">
                    <canvas id="customerChart"></canvas>
                </div>
                <table>
                    <tr>
                        <th>Customer ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Item Code</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                    </tr>
                    ${customerOrders.map(c => `
                        <tr>
                            <td rowspan="${c.orders.length+1}">${c.id}</td>
                            <td rowspan="${c.orders.length+1}">${c.name}</td>
                            <td rowspan="${c.orders.length+1}">${c.tpNumber}</td>
                        </tr>
                        ${c.orders.map(order => `
                            <tr class="order-row">
                                <td>${order.id}</td>
                                <td>${order.date}</td>
                                <td>${order.itemCode}</td>
                                <td>${order.qty}</td>
                                <td>$${order.unitPrice.toFixed(2)}</td>
                                <td>$${(order.qty * order.unitPrice).toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    `).join("")}
                </table>
                <button onclick="downloadReport()">Download Report</button>
                <script>
                    function downloadReport() {
                        const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = "Customer_Order_Report.html";
                        link.click();
                    }

                    const ctx = document.getElementById('customerChart').getContext('2d');
                    const customerChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(customerOrders.map(c => c.name))},
                            datasets: [{
                                label: 'Total Spending',
                                data: ${JSON.stringify(customerOrders.map(c => c.totalSpent))},
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: { y: { beginAtZero: true } }
                        }
                    });
                </script>
            </body>
            </html>
        `;

        // Open new tab and write report
        const newTab = window.open();
        newTab.document.write(reportHTML);
        newTab.document.close();
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load report.");
    }
});


document.querySelector(".order-report").addEventListener("click", async () => {
    try {
        // Fetch order details
        const orderResponse = await fetch("http://localhost:8080/orderdetails/all");
        if (!orderResponse.ok) throw new Error("Failed to fetch order details");
        const orders = await orderResponse.json();

        if (!orders.length) {
            alert("No order data found!");
            return;
        }

        // Fetch item details to map itemCode to itemName
        const itemResponse = await fetch("http://localhost:8080/item/getAll");
        if (!itemResponse.ok) throw new Error("Failed to fetch item details");
        const items = await itemResponse.json();

        // Create a map of itemCode -> itemName
        const itemMap = {};
        items.forEach(item => itemMap[item.id] = item.name);

        // Process data for charts
        const itemSummary = {};
        orders.forEach(order => {
            const itemName = itemMap[order.itemCode] || `Item ${order.itemCode}`;
            if (!itemSummary[itemName]) {
                itemSummary[itemName] = { qty: 0, revenue: 0 };
            }
            itemSummary[itemName].qty += order.qty;
            itemSummary[itemName].revenue += order.qty * order.unitPrice;
        });

        const itemNames = Object.keys(itemSummary);
        const totalRevenues = itemNames.map(name => itemSummary[name].revenue);
        const totalQuantities = itemNames.map(name => itemSummary[name].qty);

        // Generate the report
        const reportHTML = `
            <html>
            <head>
                <title>Order Details Report</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body { font-family: 'Poppins', sans-serif; text-align: center; background: #f4f4f4; padding: 20px; }
                    h1 { color: #333; }
                    .chart-container { width: 80%; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); margin-bottom: 20px; }
                    table { width: 90%; margin: 20px auto; border-collapse: collapse; background: white; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    th { background: #4CAF50; color: white; }
                    .order-row { background: #f9f9f9; }
                    button { padding: 10px 20px; margin: 20px; border: none; border-radius: 5px; cursor: pointer; background: #ff5733; color: white; font-size: 16px; }
                    button:hover { background: #c70039; }
                </style>
            </head>
            <body>
                <h1>Order Details Report</h1>

                <div class="chart-container">
                    <h2>Total Revenue Per Item</h2>
                    <canvas id="revenueChart"></canvas>
                </div>

                <div class="chart-container">
                    <h2>Order Quantity Distribution</h2>
                    <canvas id="quantityChart"></canvas>
                </div>

                <table>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer ID</th>
                        <th>Date</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                    </tr>
                    ${orders.map(order => `
                        <tr class="order-row">
                            <td>${order.id}</td>
                            <td>${order.customerId}</td>
                            <td>${order.date}</td>
                            <td>${itemMap[order.itemCode] || `Item ${order.itemCode}`}</td>
                            <td>${order.qty}</td>
                            <td>$${order.unitPrice.toFixed(2)}</td>
                            <td>$${(order.qty * order.unitPrice).toFixed(2)}</td>
                        </tr>
                    `).join("")}
                </table>

                <button onclick="downloadReport()">Download Report</button>

                <script>
                    function downloadReport() {
                        const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = "Order_Details_Report.html";
                        link.click();
                    }

                    // Bar Chart for Revenue
                    const ctx1 = document.getElementById('revenueChart').getContext('2d');
                    new Chart(ctx1, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(itemNames)},
                            datasets: [{
                                label: 'Total Revenue',
                                data: ${JSON.stringify(totalRevenues)},
                                backgroundColor: ['#ff5733', '#33ff57', '#3357ff', '#f1c40f', '#9b59b6'],
                                borderColor: '#222',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: { y: { beginAtZero: true } }
                        }
                    });

                    // Pie Chart for Order Quantity
                    const ctx2 = document.getElementById('quantityChart').getContext('2d');
                    new Chart(ctx2, {
                        type: 'pie',
                        data: {
                            labels: ${JSON.stringify(itemNames)},
                            datasets: [{
                                label: 'Order Quantity',
                                data: ${JSON.stringify(totalQuantities)},
                                backgroundColor: ['#ff5733', '#33ff57', '#3357ff', '#f1c40f', '#9b59b6'],
                            }]
                        },
                        options: {
                            responsive: true
                        }
                    });
                </script>
            </body>
            </html>
        `;

        // Open new tab and write report
        const newTab = window.open();
        newTab.document.write(reportHTML);
        newTab.document.close();
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load report.");
    }
});


document.querySelector(".item-report").addEventListener("click", async () => {
    try {
        // Fetch item data
        const response = await fetch("http://localhost:8080/item/getAll");
        if (!response.ok) throw new Error("Failed to fetch item data");
        const items = await response.json();

        if (!items.length) {
            alert("No items found!");
            return;
        }

        // Prepare data for charts
        const itemNames = items.map(item => item.name);
        const itemQuantities = items.map(item => item.qty);
        const categories = {};
        
        items.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
        });

        const categoryNames = Object.keys(categories);
        const categoryCounts = Object.values(categories);

        // Generate the report
        const reportHTML = `
            <html>
            <head>
                <title>Item Report</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body { font-family: 'Poppins', sans-serif; text-align: center; background: #f4f4f4; padding: 20px; }
                    h1 { color: #333; }
                    .chart-container { width: 80%; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); margin-bottom: 20px; }
                    table { width: 90%; margin: 20px auto; border-collapse: collapse; background: white; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    th { background: #4CAF50; color: white; }
                    .item-row { background: #f9f9f9; }
                    img { width: 50px; height: 50px; border-radius: 5px; }
                    button { padding: 10px 20px; margin: 20px; border: none; border-radius: 5px; cursor: pointer; background: #ff5733; color: white; font-size: 16px; }
                    button:hover { background: #c70039; }
                </style>
            </head>
            <body>
                <h1>Item Report</h1>

                <div class="chart-container">
                    <h2>Item Stock Levels</h2>
                    <canvas id="stockChart"></canvas>
                </div>

                <div class="chart-container">
                    <h2>Category Distribution</h2>
                    <canvas id="categoryChart"></canvas>
                </div>

                <table>
                    <tr>
                        <th>Item ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Image</th>
                    </tr>
                    ${items.map(item => `
                        <tr class="item-row">
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.category}</td>
                            <td>${item.qty}</td>
                            <td><img src="${item.imageUrl}" alt="${item.name}"></td>
                        </tr>
                    `).join("")}
                </table>

                <button onclick="downloadReport()">Download Report</button>

                <script>
                    function downloadReport() {
                        const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = "Item_Report.html";
                        link.click();
                    }

                    // Bar Chart for Stock Levels
                    const ctx1 = document.getElementById('stockChart').getContext('2d');
                    new Chart(ctx1, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(itemNames)},
                            datasets: [{
                                label: 'Stock Quantity',
                                data: ${JSON.stringify(itemQuantities)},
                                backgroundColor: ['#ff5733', '#33ff57', '#3357ff', '#f1c40f', '#9b59b6'],
                                borderColor: '#222',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: { y: { beginAtZero: true } }
                        }
                    });

                    // Doughnut Chart for Category Distribution
                    const ctx2 = document.getElementById('categoryChart').getContext('2d');
                    new Chart(ctx2, {
                        type: 'doughnut',
                        data: {
                            labels: ${JSON.stringify(categoryNames)},
                            datasets: [{
                                label: 'Number of Items',
                                data: ${JSON.stringify(categoryCounts)},
                                backgroundColor: ['#ff5733', '#33ff57', '#3357ff', '#f1c40f', '#9b59b6'],
                            }]
                        },
                        options: {
                            responsive: true
                        }
                    });
                </script>
            </body>
            </html>
        `;

        // Open new tab and write report
        const newTab = window.open();
        newTab.document.write(reportHTML);
        newTab.document.close();
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load report.");
    }
});
