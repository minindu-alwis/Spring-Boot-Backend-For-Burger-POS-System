document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the username and password from the form
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Create the request body
    const loginRequest = {
        username: username,
        password: password
    };

    try {
        // Send a POST request to the Spring Boot API
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json(); // Parse the JSON response
            if (result === true) {
                // Use SweetAlert for success message
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'You will be redirected to the dashboard.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Redirect to another page or perform other actions
                    window.location.href = 'homepage.html'; // Example redirect
                });
            } else {
                // Use SweetAlert for invalid credentials
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Credentials',
                    text: 'Please check your username and password.',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            // Use SweetAlert for login failure
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Please try again.',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        // Use SweetAlert for unexpected errors
        Swal.fire({
            icon: 'error',
            title: 'An Error Occurred',
            text: 'Please try again later.',
            confirmButtonText: 'OK'
        });
    }
});




// singup 




document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the username, email, and password from the form
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Create the request body
    const signupRequest = {
        username: username,
        email: email,
        password: password
    };

    try {
        // Send a POST request to the Spring Boot API
        const response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupRequest)
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json(); // Parse the JSON response
            if (result === true) {
                // Use SweetAlert for success message
                Swal.fire({
                    icon: 'success',
                    title: 'Signup Successful!',
                    text: 'You will be redirected to the login page.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Clear the form fields
                    document.getElementById('signup-form').reset();
                    // Redirect to the login tab (assuming you have a way to switch tabs)
                    showLoginForm(); // Call a function to show the login form
                });
            } else {
                // Use SweetAlert for signup failure
                Swal.fire({
                    icon: 'error',
                    title: 'Signup Failed',
                    text: 'Username or email already exists.',
                    confirmButtonText: 'OK'
                });
                // Clear the form fields
                document.getElementById('signup-form').reset();
            }
        } else {
            // Use SweetAlert for API errors
            Swal.fire({
                icon: 'error',
                title: 'Signup Failed',
                text: 'Please try again.',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        // Use SweetAlert for unexpected errors
        Swal.fire({
            icon: 'error',
            title: 'An Error Occurred',
            text: 'Please try again later.',
            confirmButtonText: 'OK'
        });
    }
});

// Function to show the login form (assuming you have a way to switch tabs)
function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
}