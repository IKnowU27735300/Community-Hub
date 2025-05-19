// User management
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// Events management with local storage
let events = JSON.parse(localStorage.getItem('events')) || [{
        id: 1,
        title: 'Community Garden Cleanup',
        description: 'Join us for a morning of gardening and community building.',
        date: '2024-04-15T09:00',
        location: 'Community Garden, Main Street',
        createdBy: 'admin'
    },
    {
        id: 2,
        title: 'Food Drive',
        description: 'Help collect and distribute food to those in need.',
        date: '2024-04-20T10:00',
        location: 'Community Center',
        createdBy: 'admin'
    }
];

// Save events to local storage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Save users to local storage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to format date
function formatDate(dateString) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to display events
function displayEvents() {
    const eventsContainer = document.getElementById('eventsList');
    if (!eventsContainer) {
        console.log('Events container not found');
        return;
    }

    // Clear events container
    eventsContainer.innerHTML = '';

    // Check if there are any events
    if (events.length === 0) {
        eventsContainer.innerHTML = '<p class="no-events">No events found</p>';
        return;
    }

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Create event cards
    sortedEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

// Function to create event card
function createEventCard(event) {
    const card = document.createElement('div');
    card.classList.add('event-card');

    // Format date
    const formattedDate = formatDate(event.date);

    // Get user
    const user = JSON.parse(localStorage.getItem('user'));

    // Get category-specific image
    const categoryImages = {
        'Community': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'Volunteer': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'Charity': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'default': 'https://images.unsplash.com/photo-1511795409834-432f7b1728d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    };

    const eventImage = categoryImages[event.category] || categoryImages.default;

    // Create card content
    card.innerHTML = `
        <div class="event-card-header">
            <h3>${event.title}</h3>
            <span class="event-category">${event.category}</span>
        </div>
        <div class="event-card-body">
            <img src="${eventImage}" alt="${event.title}" class="event-image">
            <div class="event-meta">
                <div class="event-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${event.time}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-users"></i>
                    <span>${event.attendees ? event.attendees.length : 0} / ${event.capacity}</span>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
        </div>
        <div class="event-card-footer">
            <a href="event-details.html?id=${event.id}" class="btn">View Details</a>
            ${user && user.email === event.createdBy ? `
                <button class="btn btn-danger" onclick="handleEventDeletion(${event.id})">Delete Event</button>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Function to display event details
function displayEventDetails() {
    const eventDetailsContainer = document.getElementById('eventDetails');
    if (!eventDetailsContainer) {
        console.log('Event details container not found');
        return;
    }
    
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    
    // Find the event
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        eventDetailsContainer.innerHTML = '<p class="error-message">Event not found</p>';
        return;
    }
    
    // Get user
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Format date
    const formattedDate = formatDate(event.date);
    
    // Get category-specific image
    const categoryImages = {
        'Community': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'Volunteer': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'Charity': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'default': 'https://images.unsplash.com/photo-1511795409834-432f7b1728d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    };
    
    const eventImage = categoryImages[event.category] || categoryImages.default;
    
    // Create event details content
    eventDetailsContainer.innerHTML = `
        <div class="event-header">
            <h1 class="event-title">${event.title}</h1>
            <span class="event-category">${event.category}</span>
        </div>
        <div class="event-image-container">
            <img src="${eventImage}" alt="${event.title}" class="event-image">
        </div>
        <div class="event-meta">
            <div class="event-meta-item">
                <i class="fas fa-calendar"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-clock"></i>
                <span>${event.time}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-users"></i>
                <span>${event.attendees ? event.attendees.length : 0} / ${event.capacity}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-user"></i>
                <span>Created by: ${event.createdBy}</span>
            </div>
        </div>
        <div class="event-description">
            <h3>Description</h3>
            <p>${event.description}</p>
        </div>
        ${event.price ? `
            <div class="event-price">
                <h3>Price</h3>
                <p>$${event.price}</p>
            </div>
        ` : ''}
        <div class="event-actions">
            ${user ? `
                ${event.attendees && event.attendees.includes(user.email) ? `
                    <p class="success-message">You are registered for this event</p>
                ` : `
                    <a href="event-registration.html?id=${event.id}" class="btn">Register for Event</a>
                `}
                ${user.email === event.createdBy ? `
                    <button class="btn btn-secondary" onclick="handleEventDeletion(${event.id})">Delete Event</button>
                ` : ''}
            ` : `
                <p class="info-message">Please <a href="auth.html">log in</a> to register for this event</p>
            `}
        </div>
    `;
}

// Function to handle event deletion
function handleEventDeletion(eventId) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to delete an event');
        window.location.href = 'auth.html';
        return;
    }
    
    // Find the event
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
        alert('Event not found');
        return;
    }
    
    const event = events[eventIndex];
    
    // Check if user is the creator of the event
    if (event.createdBy !== user.email) {
        alert('You can only delete events that you created');
        return;
    }
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this event?')) {
        // Remove event from events array
        events.splice(eventIndex, 1);
        
        // Save events to localStorage
        saveEvents();
        
        // Redirect to events page
        window.location.href = 'events.html';
    }
}

// Form validation
function validateForm(formData) {
    const errors = {};

    if (!formData.title || !formData.title.trim()) {
        errors.title = 'Title is required';
    }

    if (!formData.description || !formData.description.trim()) {
        errors.description = 'Description is required';
    }

    if (!formData.date) {
        errors.date = 'Date is required';
    }

    if (!formData.location || !formData.location.trim()) {
        errors.location = 'Location is required';
    }

    return errors;
}

// Function to handle event creation
function handleEventCreation() {
    const createEventForm = document.getElementById('createEventForm');
    if (!createEventForm) {
        console.log('Create event form not found');
        return;
    }
    
    // Set up live capacity counter
    const capacityInput = document.getElementById('eventCapacity');
    const capacityDisplay = document.getElementById('capacityDisplay');
    
    if (capacityInput && capacityDisplay) {
        // Update display on input change
        capacityInput.addEventListener('input', function() {
            const capacity = this.value || 0;
            capacityDisplay.textContent = `0/${capacity}`;
        });
        
        // Initialize display
        capacityDisplay.textContent = `0/${capacityInput.value || 0}`;
    }
    
    createEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please log in to create an event');
            window.location.href = 'auth.html';
            return;
        }
        
        // Get form data
        const formData = {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            category: document.getElementById('eventCategory').value,
            capacity: document.getElementById('eventCapacity').value,
            price: document.getElementById('eventPrice').value,
            createdBy: user.email,
            createdAt: new Date().toISOString(),
            attendees: []
        };
        
        // Validate form
        const errors = validateEventForm(formData);
        if (Object.keys(errors).length > 0) {
            // Display errors
            Object.keys(errors).forEach(field => {
                const input = document.getElementById(field);
                if (input) {
                    input.classList.add('error');
                    
                    let errorMessage = input.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        input.parentNode.insertBefore(errorMessage, input.nextSibling);
                    }
                    errorMessage.textContent = errors[field];
                }
            });
            return;
        }
        
        // Clear any existing errors
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Create new event
        const newEvent = {
            id: Date.now(),
            ...formData
        };
        
        // Add event to events array
        events.push(newEvent);
        
        // Save events to localStorage
        saveEvents();
        
        // Show success message
        alert('Event created successfully!');
        
        // Redirect to events page
        window.location.href = 'events.html';
    });
}

// Function to validate event form
function validateEventForm(formData) {
    const errors = {};
    
    if (!formData.title) {
        errors.eventTitle = 'Event title is required';
    }
    
    if (!formData.date) {
        errors.eventDate = 'Event date is required';
    } else {
        const eventDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
            errors.eventDate = 'Event date cannot be in the past';
        }
    }
    
    if (!formData.time) {
        errors.eventTime = 'Event time is required';
    }
    
    if (!formData.location) {
        errors.eventLocation = 'Event location is required';
    }
    
    if (!formData.description) {
        errors.eventDescription = 'Event description is required';
    }
    
    if (!formData.category) {
        errors.eventCategory = 'Event category is required';
    }
    
    if (!formData.capacity) {
        errors.eventCapacity = 'Event capacity is required';
    } else if (isNaN(formData.capacity) || formData.capacity < 1) {
        errors.eventCapacity = 'Event capacity must be a positive number';
    }
    
    if (formData.price && (isNaN(formData.price) || formData.price < 0)) {
        errors.eventPrice = 'Event price must be a non-negative number';
    }
    
    return errors;
}

// Authentication state management
function initializeAuth() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        currentUser = user;
        updateNavigation(true, user.role);
    } else {
        updateNavigation(false);
    }

    // Add event listeners for auth links
    const authLink = document.getElementById('authLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (authLink) {
        authLink.addEventListener('click', function(e) {
            if (currentUser) {
                e.preventDefault();
                window.location.href = 'profile.html';
            }
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    currentUser = null;
    updateNavigation(false);
    window.location.href = 'index.html';
}

function updateNavigation(isLoggedIn, role = null) {
    const authLink = document.getElementById('authLink');
    const logoutLink = document.getElementById('logoutLink');
    const createEventLink = document.getElementById('createEventLink');
    const profileLink = document.querySelector('a[href="profile.html"]');

    if (authLink) authLink.style.display = isLoggedIn ? 'none' : 'block';
    if (logoutLink) logoutLink.style.display = isLoggedIn ? 'block' : 'none';
    if (createEventLink) createEventLink.style.display = (isLoggedIn && role === 'organizer') ? 'block' : 'none';
    if (profileLink) profileLink.style.display = isLoggedIn ? 'block' : 'none';
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'auth.html';
        return false;
    }
    return true;
}

function checkRoleAccess(requiredRole) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== requiredRole) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Function to display user profile
function displayProfile() {
    const notLoggedInContainer = document.getElementById('not-logged-in');
    const profileContent = document.getElementById('profile-content');
    
    if (!notLoggedInContainer || !profileContent) {
        console.log('Profile containers not found');
        return;
    }
    
    // Get user
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        // User is not logged in
        notLoggedInContainer.style.display = 'block';
        profileContent.style.display = 'none';
        return;
    }
    
    // User is logged in
    notLoggedInContainer.style.display = 'none';
    profileContent.style.display = 'block';
    
    // Update profile information
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-location').textContent = user.location || 'Not specified';
    
    // Set profile initials
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('profile-initials').textContent = initials;
    
    // Get user's events
    const userEvents = events.filter(event => event.createdBy === user.email);
    
    // Get user's registrations
    const userRegistrations = getUserRegistrations();
    
    // Update my events list
    const myEventsList = document.getElementById('my-events-list');
    if (myEventsList) {
        if (userEvents.length > 0) {
            myEventsList.innerHTML = userEvents.map(event => `
                <div class="event-card">
                    <div class="event-card-header">
                        <h3>${event.title}</h3>
                    </div>
                    <div class="event-card-body">
                        <div class="event-meta">
                            <div class="event-meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${formatDate(event.date)}</span>
                            </div>
                            <div class="event-meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.location}</span>
                            </div>
                            <div class="event-meta-item">
                                <i class="fas fa-users"></i>
                                <span>${event.attendees ? event.attendees.length : 0} / ${event.capacity || 'Unlimited'}</span>
                            </div>
                        </div>
                        <p class="event-description">${event.description}</p>
                    </div>
                    <div class="event-card-footer">
                        <a href="event-details.html?id=${event.id}" class="btn btn-primary">View Details</a>
                        <button class="btn btn-danger" onclick="handleEventDeletion(${event.id})">Delete Event</button>
                    </div>
                </div>
            `).join('');
        } else {
            myEventsList.innerHTML = '<p class="info-message">You haven\'t created any events yet</p>';
        }
    }
    
    // Update attending events list
    const attendingEventsList = document.getElementById('attending-events-list');
    if (attendingEventsList) {
        if (userRegistrations.length > 0) {
            attendingEventsList.innerHTML = userRegistrations.map(registration => {
                const event = events.find(e => e.id === registration.eventId);
                if (!event) return '';
                
                return `
                    <div class="event-card">
                        <div class="event-card-header">
                            <h3>${event.title}</h3>
                        </div>
                        <div class="event-card-body">
                            <div class="event-meta">
                                <div class="event-meta-item">
                                    <i class="fas fa-calendar"></i>
                                    <span>${formatDate(event.date)}</span>
                                </div>
                                <div class="event-meta-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${event.location}</span>
                                </div>
                            </div>
                            <p class="event-description">${event.description}</p>
                        </div>
                        <div class="event-card-footer">
                            <a href="event-details.html?id=${event.id}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            attendingEventsList.innerHTML = '<p class="info-message">You haven\'t registered for any events yet</p>';
        }
    }
}

// Initialize profile page if on profile.html
if (window.location.pathname.includes('profile.html')) {
    displayProfile();
}

// Function to display event details for registration
function displayEventRegistrationDetails() {
    const eventDetailsCard = document.getElementById('eventDetailsCard');
    const registrationForm = document.getElementById('registrationForm');
    const registrationSuccess = document.getElementById('registrationSuccess');
    const notLoggedIn = document.getElementById('notLoggedIn');
    const eventNotFound = document.getElementById('eventNotFound');
    
    if (!eventDetailsCard || !registrationForm || !registrationSuccess || !notLoggedIn || !eventNotFound) {
        console.log('Registration elements not found');
        return;
    }
    
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    
    // Find the event
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        console.log('Event not found');
        // Event not found
        eventDetailsCard.style.display = 'none';
        registrationForm.style.display = 'none';
        registrationSuccess.style.display = 'none';
        notLoggedIn.style.display = 'none';
        eventNotFound.style.display = 'block';
        return;
    }
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.log('User not logged in');
        eventDetailsCard.style.display = 'none';
        registrationForm.style.display = 'none';
        registrationSuccess.style.display = 'none';
        notLoggedIn.style.display = 'block';
        eventNotFound.style.display = 'none';
        return;
    }
    
    console.log('Displaying event registration details');
    // Display event details
    eventDetailsCard.style.display = 'block';
    eventDetailsCard.innerHTML = `
        <h2>${event.title}</h2>
        <div class="event-meta">
            <div class="event-meta-item">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(event.date)}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-clock"></i>
                <span>${event.time}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-users"></i>
                <span>${event.attendees ? event.attendees.length : 0} / ${event.capacity}</span>
            </div>
            <div class="event-meta-item">
                <i class="fas fa-user"></i>
                <span>Created by: ${event.createdBy}</span>
            </div>
        </div>
        <div class="event-description">
            <p>${event.description}</p>
        </div>
        ${event.price ? `
            <div class="event-price">
                <h3>Price</h3>
                <p>$${event.price}</p>
            </div>
        ` : ''}
    `;
    
    // Pre-fill form with user data if available
    if (user) {
        document.getElementById('name').value = user.name || '';
        document.getElementById('email').value = user.email || '';
    }
    
    // Handle form submission
    const eventRegistrationForm = document.getElementById('eventRegistrationForm');
    if (eventRegistrationForm) {
        eventRegistrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check if event is at capacity
            if (event.attendees && event.attendees.length >= event.capacity) {
                alert('Sorry, this event is already at capacity.');
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                guests: document.getElementById('guests').value,
                notes: document.getElementById('notes').value,
                eventId: eventId,
                eventTitle: event.title,
                eventDate: event.date,
                registrationDate: new Date().toISOString()
            };
            
            // Validate form
            const errors = validateRegistrationForm(formData);
            if (Object.keys(errors).length > 0) {
                // Display errors
                Object.keys(errors).forEach(field => {
                    const input = document.getElementById(field);
                    input.classList.add('error');
                    
                    let errorMessage = input.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        input.parentNode.insertBefore(errorMessage, input.nextSibling);
                    }
                    errorMessage.textContent = errors[field];
                });
                return;
            }
            
            // Clear any existing errors
            document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Save registration
            saveRegistration(formData);
            
            // Update event attendees
            if (!event.attendees) {
                event.attendees = [];
            }
            if (!event.attendees.includes(user.email)) {
                event.attendees.push(user.email);
                saveEvents();
            }
            
            // Show success message
            eventDetailsCard.style.display = 'none';
            registrationForm.style.display = 'none';
            registrationSuccess.style.display = 'block';
            notLoggedIn.style.display = 'none';
            eventNotFound.style.display = 'none';
        });
    }
}

// Function to validate registration form
function validateRegistrationForm(formData) {
    const errors = {};
    
    if (!formData.name || !formData.name.trim()) {
        errors.name = 'Name is required';
    }
    
    if (!formData.email || !formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone || !formData.phone.trim()) {
        errors.phone = 'Phone number is required';
    }
    
    return errors;
}

// Function to validate email format
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Function to save registration
function saveRegistration(registration) {
    // Get existing registrations or initialize empty array
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    
    // Add new registration
    registrations.push(registration);
    
    // Save to localStorage
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

// Function to get user registrations
function getUserRegistrations() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return [];
    
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    return registrations.filter(reg => reg.email === user.email);
}

// Page transition effect
function createPageTransition() {
    // Create transition element
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    
    // Add event listeners to all navigation links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Skip if it's an anchor link or external link
            if (link.getAttribute('href').startsWith('#') || 
                link.getAttribute('href').startsWith('http') || 
                link.getAttribute('href').startsWith('//')) {
                return;
            }
            
            e.preventDefault();
            
            // Activate transition
            transition.classList.add('active');
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = link.getAttribute('href');
            }, 500);
        });
    });
}

// Scroll effects
function initScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Search functionality
function initSearchFunctionality() {
    const eventSearch = document.getElementById('event-search');
    const searchButton = document.getElementById('search-button');
    const searchTags = document.querySelectorAll('.search-tag');
    const eventsGrid = document.querySelector('.events-grid') || document.querySelector('.features-grid');
    
    if (!eventSearch || !searchButton || !eventsGrid) return;
    
    function searchEvents(keyword) {
        const eventCards = document.querySelectorAll('.feature-card');
        let hasResults = false;

        eventCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const searchTerm = keyword.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        let noResults = document.querySelector('.no-results');
        if (!hasResults) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No events found matching "${keyword}"</p>
                `;
                eventsGrid.parentNode.insertBefore(noResults, eventsGrid);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    // Search button click handler
    searchButton.addEventListener('click', () => {
        searchEvents(eventSearch.value);
    });

    // Enter key handler
    eventSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchEvents(eventSearch.value);
        }
    });

    // Search tags click handler
    searchTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Toggle active class on clicked tag
            if (tag.classList.contains('active')) {
                // If already active, deactivate it
                tag.classList.remove('active');
                eventSearch.value = '';
            } else {
                // Remove active class from all tags
                searchTags.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tag
                tag.classList.add('active');
                // Search with tag text
                eventSearch.value = tag.textContent;
            }
            
            // Perform search
            searchEvents(eventSearch.value);
        });
    });
}

// Time slot management functions
function generateTimeSlots(date) {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 21; // 9 PM
    const slotDuration = 2; // 2 hours per slot

    for (let hour = startHour; hour < endHour; hour += slotDuration) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(hour + slotDuration, 0, 0, 0);

        slots.push({
            start: startTime,
            end: endTime,
            available: true
        });
    }
    return slots;
}

function checkTimeSlotConflict(eventDate, eventTime, eventLocation) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const newEventStart = new Date(eventDate);
    const [hours, minutes] = eventTime.split(':').map(Number);
    newEventStart.setHours(hours, minutes, 0, 0);
    
    const newEventEnd = new Date(newEventStart);
    newEventEnd.setHours(newEventStart.getHours() + 2); // 2-hour duration

    return events.some(event => {
        const existingEventStart = new Date(event.date);
        const [existingHours, existingMinutes] = event.time.split(':').map(Number);
        existingEventStart.setHours(existingHours, existingMinutes, 0, 0);
        
        const existingEventEnd = new Date(existingEventStart);
        existingEventEnd.setHours(existingEventStart.getHours() + 2);

        // Check if dates match and times overlap
        const sameDate = eventDate === event.date;
        const timeOverlap = (
            (newEventStart >= existingEventStart && newEventStart < existingEventEnd) ||
            (newEventEnd > existingEventStart && newEventEnd <= existingEventEnd)
        );
        const sameLocation = eventLocation === event.location;

        return sameDate && timeOverlap && sameLocation;
    });
}

function getAvailableTimeSlots(date, location) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const allSlots = generateTimeSlots(date);
    
    // Mark slots as unavailable if they conflict with existing events
    events.forEach(event => {
        if (event.date === date && event.location === location) {
            const [hours, minutes] = event.time.split(':').map(Number);
            const eventStart = new Date(date);
            eventStart.setHours(hours, minutes, 0, 0);
            
            const eventEnd = new Date(eventStart);
            eventEnd.setHours(eventStart.getHours() + 2);

            allSlots.forEach(slot => {
                if (
                    (slot.start >= eventStart && slot.start < eventEnd) ||
                    (slot.end > eventStart && slot.end <= eventEnd)
                ) {
                    slot.available = false;
                }
            });
        }
    });

    return allSlots;
}

function formatTimeSlot(time) {
    return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Update the handleCreateEvent function
function handleCreateEvent(event) {
    event.preventDefault();
    
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const category = document.getElementById('eventCategory').value;
    const image = document.getElementById('eventImage').value;
    const price = document.getElementById('eventPrice').value;

    // Validate time slot
    if (checkTimeSlotConflict(date, time, location)) {
        const availableSlots = getAvailableTimeSlots(date, location);
        const availableTimes = availableSlots
            .filter(slot => slot.available)
            .map(slot => formatTimeSlot(slot.start))
            .join(', ');

        alert(`This time slot is already taken at ${location}. Please choose another time.\n\nAvailable time slots:\n${availableTimes}`);
        return;
    }

    // Create new event
    const newEvent = {
        id: Date.now(),
        title,
        description,
        date,
        time,
        location,
        category,
        image,
        price,
        createdAt: new Date().toISOString()
    };

    // Save event
    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));

    // Redirect to events page
    window.location.href = 'events.html';
}

// Add time slot validation to the event form
document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('createEventForm');
    const dateInput = document.getElementById('eventDate');
    const timeInput = document.getElementById('eventTime');
    const locationInput = document.getElementById('eventLocation');

    if (eventForm) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        // Update available time slots when date or location changes
        function updateTimeSlots() {
            const date = dateInput.value;
            const location = locationInput.value;
            
            if (date && location) {
                const availableSlots = getAvailableTimeSlots(date, location);
                const availableTimes = availableSlots
                    .filter(slot => slot.available)
                    .map(slot => formatTimeSlot(slot.start));

                // Update time input options
                timeInput.innerHTML = availableTimes
                    .map(time => `<option value="${time}">${time}</option>`)
                    .join('');

                if (availableTimes.length === 0) {
                    alert(`No available time slots for ${date} at ${location}. Please choose another date or location.`);
                }
            }
        }

        dateInput.addEventListener('change', updateTimeSlots);
        locationInput.addEventListener('change', updateTimeSlots);
    }
});

// Function to delete all events
function deleteAllEvents() {
    if (confirm('Are you sure you want to delete ALL events? This action cannot be undone.')) {
        localStorage.setItem('events', JSON.stringify([]));
        alert('All events have been deleted successfully.');
        // Refresh the page if we're on the events page
        if (window.location.pathname.includes('events.html')) {
            window.location.reload();
        }
    }
}

// Make the function available globally
window.deleteAllEvents = deleteAllEvents;