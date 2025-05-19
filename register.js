// DOM Elements
const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Form validation patterns
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Error messages
const errorMessages = {
    name: 'Please enter your full name',
    email: 'Please enter a valid email address',
    password: 'Password must meet all requirements',
    confirmPassword: 'Passwords do not match'
};

// Password requirement elements
const passwordRequirements = {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number'),
    special: document.getElementById('special')
};

// Show error message
function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.classList.add('error');
}

// Clear error message
function clearError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    input.classList.remove('error');
}

// Validate name
function validateName(name) {
    return name.trim().length > 0;
}

// Validate email format
function validateEmail(email) {
    return emailPattern.test(email);
}

// Check if email is already registered
function isEmailRegistered(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.email === email);
}

// Validate password strength
function validatePassword(password) {
    return passwordPattern.test(password);
}

// Update password requirements UI
function updatePasswordRequirements(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&]/.test(password)
    };

    Object.entries(requirements).forEach(([key, isValid]) => {
        if (isValid) {
            passwordRequirements[key].classList.add('valid');
        } else {
            passwordRequirements[key].classList.remove('valid');
        }
    });
}

// Handle form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    clearError(nameInput);
    clearError(emailInput);
    clearError(passwordInput);
    clearError(confirmPasswordInput);

    // Get form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate inputs
    let isValid = true;

    if (!validateName(name)) {
        showError(nameInput, errorMessages.name);
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError(emailInput, errorMessages.email);
        isValid = false;
    } else if (isEmailRegistered(email)) {
        showError(emailInput, 'This email is already registered');
        isValid = false;
    }

    if (!validatePassword(password)) {
        showError(passwordInput, errorMessages.password);
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError(confirmPasswordInput, errorMessages.confirmPassword);
        isValid = false;
    }

    if (!isValid) return;

    // Create new user
    const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Redirect to login page
    window.location.href = 'auth.html';
});

// Add real-time password validation
passwordInput.addEventListener('input', (e) => {
    updatePasswordRequirements(e.target.value);
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
        window.location.href = 'index.html';
    }
});