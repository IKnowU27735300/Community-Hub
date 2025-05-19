// Authentication state management
let currentUser = null;
let verificationCode = null;
let verificationAttempts = 0;
const MAX_VERIFICATION_ATTEMPTS = 3;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const verificationForm = document.getElementById('verificationForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const verificationCodeInput = document.getElementById('verificationCode');
const verificationInfo = document.querySelector('.verification-info');

// Form validation patterns
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Error messages
const errorMessages = {
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    verificationCode: 'Please enter a valid 6-digit verification code',
    maxAttempts: 'Maximum verification attempts reached. Please try again later.',
    emailSendError: 'Failed to send verification email. Please try again.'
};

// Generate a random 6-digit verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email using EmailJS
async function sendVerificationEmail(email, code) {
    try {
        const templateParams = {
            to_email: email,
            verification_code: code,
            from_name: 'Event Vesta',
            to_name: email.split('@')[0],
            message: `Your verification code is: ${code}. This code will expire in 10 minutes.`
        };

        // Send email using EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        if (response.status !== 200) {
            throw new Error('Failed to send email');
        }

        // Log success and code for testing
        console.log('Email sent successfully');
        console.log('Verification code:', code);

        verificationCode = code;
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error(errorMessages.emailSendError);
    }
}

// Validate email format
function validateEmail(email) {
    return emailPattern.test(email);
}

// Validate password strength
function validatePassword(password) {
    return passwordPattern.test(password);
}

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

// Update verification info message
function updateVerificationInfo(email) {
    verificationInfo.innerHTML = `
        <p>We've sent a verification code to <strong>${email}</strong>.</p>
        <p>Please enter the 6-digit code below:</p>
        <p class="attempts-info">Attempts remaining: ${MAX_VERIFICATION_ATTEMPTS - verificationAttempts}</p>
    `;
}

// Handle login form submission
loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    // Clear previous errors
    clearError(emailInput);
    clearError(passwordInput);

    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate inputs
    let isValid = true;

    if (!validateEmail(email)) {
        showError(emailInput, errorMessages.email);
        isValid = false;
    }

    if (!validatePassword(password)) {
        showError(passwordInput, errorMessages.password);
        isValid = false;
    }

    if (!isValid) return;

    try {
        // Generate and send verification code
        const code = generateVerificationCode();
        await sendVerificationEmail(email, code);

        // Store user data temporarily
        currentUser = { email, password };

        // Update verification info
        updateVerificationInfo(email);

        // Show verification form
        loginForm.style.display = 'none';
        verificationForm.style.display = 'block';

        // Reset verification attempts
        verificationAttempts = 0;
    } catch (error) {
        showError(emailInput, error.message);
    }
});

// Handle verification form submission
verificationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous error
    clearError(verificationCodeInput);

    const code = verificationCodeInput.value.trim();

    // Check max attempts
    if (verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
        showError(verificationCodeInput, errorMessages.maxAttempts);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
        return;
    }

    // Validate verification code
    if (code !== verificationCode) {
        verificationAttempts++;
        updateVerificationInfo(currentUser.email);
        showError(verificationCodeInput, errorMessages.verificationCode);
        return;
    }

    // Successful verification
    localStorage.setItem('user', JSON.stringify(currentUser));
    window.location.href = 'index.html';
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
        window.location.href = 'index.html';
    }
});