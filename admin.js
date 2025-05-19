// Admin Panel JavaScript

// Check if user has admin access
function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Initialize admin panel
function initializeAdminPanel() {
    const user = checkAdminAccess();
    if (!user) return;

    // Set admin name
    document.getElementById('adminName').textContent = user.name || 'Admin User';

    // Load initial data
    loadDashboardData();
    loadUsersTable();
    loadEventsTable();
    loadRegistrationsTable();
    loadCategoriesTable();
    loadSettings();

    // Setup event listeners
    setupEventListeners();
}

// Load dashboard data
function loadDashboardData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    // Update dashboard cards
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-events').textContent = events.length;
    document.getElementById('total-registrations').textContent = registrations.length;
    document.getElementById('total-categories').textContent = categories.length;

    // Load recent events
    const recentEventsTable = document.getElementById('recent-events-table');
    recentEventsTable.innerHTML = '';
    events.slice(0, 5).forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.title}</td>
            <td>${event.category || 'Uncategorized'}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.location}</td>
            <td>${event.createdBy || 'Unknown'}</td>
            <td>
                <button class="admin-btn admin-btn-primary" onclick="viewEvent('${event.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        recentEventsTable.appendChild(row);
    });

    // Load recent users
    const recentUsersTable = document.getElementById('recent-users-table');
    recentUsersTable.innerHTML = '';
    users.slice(0, 5).forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.location || 'Not specified'}</td>
            <td>${formatDate(user.joinedDate)}</td>
            <td><span class="admin-badge admin-badge-success">Active</span></td>
            <td>
                <button class="admin-btn admin-btn-primary" onclick="viewUser('${user.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        recentUsersTable.appendChild(row);
    });
}

// Load users table
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersTable = document.getElementById('users-table');
    usersTable.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.location || 'Not specified'}</td>
            <td>${formatDate(user.joinedDate)}</td>
            <td><span class="admin-badge admin-badge-success">Active</span></td>
            <td>
                <button class="admin-btn admin-btn-primary" onclick="viewUser('${user.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="admin-btn admin-btn-danger" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        usersTable.appendChild(row);
    });
}

// Load events table
function loadEventsTable() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    const eventsTable = document.getElementById('events-table');
    eventsTable.innerHTML = '';

    events.forEach(event => {
        const eventRegistrations = registrations.filter(reg => reg.eventId === event.id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.title}</td>
            <td>${event.category || 'Uncategorized'}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.location}</td>
            <td>${event.createdBy || 'Unknown'}</td>
            <td>${eventRegistrations.length}</td>
            <td>
                <button class="admin-btn admin-btn-primary" onclick="viewEvent('${event.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="admin-btn admin-btn-danger" onclick="deleteEvent('${event.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        eventsTable.appendChild(row);
    });
}

// Load registrations table
function loadRegistrationsTable() {
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const registrationsTable = document.getElementById('registrations-table');
    registrationsTable.innerHTML = '';

    registrations.forEach(registration => {
        const event = events.find(e => e.id === registration.eventId) || {};
        const user = users.find(u => u.id === registration.userId) || {};
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.title || 'Unknown Event'}</td>
            <td>${user.name || 'Unknown User'}</td>
            <td>${formatDate(registration.registrationDate)}</td>
            <td><span class="admin-badge admin-badge-success">Confirmed</span></td>
            <td>
                <button class="admin-btn admin-btn-danger" onclick="deleteRegistration('${registration.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        registrationsTable.appendChild(row);
    });
}

// Load categories table
function loadCategoriesTable() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const categoriesTable = document.getElementById('categories-table');
    categoriesTable.innerHTML = '';

    categories.forEach(category => {
        const categoryEvents = events.filter(event => event.category === category.name);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.name}</td>
            <td>${category.description || 'No description'}</td>
            <td>${categoryEvents.length}</td>
            <td>
                <button class="admin-btn admin-btn-primary" onclick="editCategory('${category.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn admin-btn-danger" onclick="deleteCategory('${category.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        categoriesTable.appendChild(row);
    });
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {
        siteName: 'Event Vesta',
        siteDescription: 'A platform for connecting communities through service events.',
        contactEmail: 'contact@communityservicehub.com',
        maxEvents: 10,
        maxRegistrations: 20
    };

    document.getElementById('site-name').value = settings.siteName;
    document.getElementById('site-description').value = settings.siteDescription;
    document.getElementById('contact-email').value = settings.contactEmail;
    document.getElementById('max-events').value = settings.maxEvents;
    document.getElementById('max-registrations').value = settings.maxRegistrations;
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.currentTarget.getAttribute('data-tab');

            if (tab === 'logout') {
                handleLogout();
                return;
            }

            // Update active tab
            document.querySelectorAll('.admin-menu a').forEach(a => a.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Show selected content
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab).classList.add('active');

            // Update header title
            document.querySelector('.admin-header h1').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
        });
    });

    // Modal controls
    document.querySelectorAll('.admin-modal-close, .admin-btn-secondary').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.admin-modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Add user button
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            document.getElementById('add-user-modal').style.display = 'flex';
        });
    }

    // Add event button
    const addEventBtn = document.getElementById('add-event-btn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => {
            populateEventCreatorDropdown();
            document.getElementById('add-event-modal').style.display = 'flex';
        });
    }

    // Add category button
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            document.getElementById('add-category-modal').style.display = 'flex';
        });
    }

    // Save user button
    const saveUserBtn = document.getElementById('save-user-btn');
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', handleAddUser);
    }

    // Save event button
    const saveEventBtn = document.getElementById('save-event-btn');
    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', handleAddEvent);
    }

    // Save category button
    const saveCategoryBtn = document.getElementById('save-category-btn');
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', handleAddCategory);
    }

    // Settings buttons
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', handleSaveSettings);
    }

    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', handleResetSettings);
    }
}

// Populate event creator dropdown
function populateEventCreatorDropdown() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const creatorSelect = document.getElementById('event-creator');
    creatorSelect.innerHTML = '';

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        creatorSelect.appendChild(option);
    });
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Handle add user
function handleAddUser() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const location = document.getElementById('user-location').value;
    const role = document.getElementById('user-role').value;

    if (!name || !email || !password) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        location,
        isAdmin: role === 'admin',
        joinedDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('add-user-modal').style.display = 'none';
    showAlert('User added successfully', 'success');
    loadUsersTable();
    loadDashboardData();
}

// Handle add event
function handleAddEvent() {
    const title = document.getElementById('event-title').value;
    const category = document.getElementById('event-category').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const location = document.getElementById('event-location').value;
    const description = document.getElementById('event-description').value;
    const creatorId = document.getElementById('event-creator').value;

    if (!title || !category || !date || !time || !location || !description || !creatorId) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const creator = users.find(user => user.id === creatorId);

    const events = JSON.parse(localStorage.getItem('events')) || [];
    const newEvent = {
        id: Date.now().toString(), // Use timestamp as ID for better uniqueness
        title,
        category,
        date: `${date}T${time}`,
        location,
        description,
        createdBy: creator ? creator.name : 'Unknown',
        creatorId,
        createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));

    // Clear the form
    document.getElementById('event-title').value = '';
    document.getElementById('event-category').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('event-time').value = '';
    document.getElementById('event-location').value = '';
    document.getElementById('event-description').value = '';
    document.getElementById('event-creator').value = '';

    document.getElementById('add-event-modal').style.display = 'none';
    showAlert('Event added successfully', 'success');
    loadEventsTable();
    loadDashboardData();
}

// Handle add category
function handleAddCategory() {
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;

    if (!name) {
        showAlert('Please enter a category name', 'error');
        return;
    }

    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const newCategory = {
        id: generateId(),
        name,
        description
    };

    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));

    document.getElementById('add-category-modal').style.display = 'none';
    showAlert('Category added successfully', 'success');
    loadCategoriesTable();
    loadDashboardData();
}

// Handle save settings
function handleSaveSettings() {
    const settings = {
        siteName: document.getElementById('site-name').value,
        siteDescription: document.getElementById('site-description').value,
        contactEmail: document.getElementById('contact-email').value,
        maxEvents: parseInt(document.getElementById('max-events').value),
        maxRegistrations: parseInt(document.getElementById('max-registrations').value)
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    showAlert('Settings saved successfully', 'success');
}

// Handle reset settings
function handleResetSettings() {
    loadSettings();
    showAlert('Settings reset to default', 'info');
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Also delete user's events and registrations
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = events.filter(event => event.creatorId !== userId);
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
        const updatedRegistrations = registrations.filter(reg => reg.userId !== userId);
        localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));

        showAlert('User deleted successfully', 'success');
        loadUsersTable();
        loadEventsTable();
        loadRegistrationsTable();
        loadDashboardData();
    }
}

// Delete event
function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        try {
            // Get all events
            const events = JSON.parse(localStorage.getItem('events')) || [];

            // Find the event to delete
            const eventToDelete = events.find(event => event.id === eventId);

            if (!eventToDelete) {
                console.error('Event not found:', eventId);
                console.log('Available events:', events);
                showAlert('Event not found', 'error');
                return;
            }

            // Remove the event from the events array
            const updatedEvents = events.filter(event => event.id !== eventId);

            // Update localStorage with the new events array
            localStorage.setItem('events', JSON.stringify(updatedEvents));

            // Also delete related registrations
            const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
            const updatedRegistrations = registrations.filter(reg => reg.eventId !== eventId);
            localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));

            // Update the UI
            loadEventsTable();
            loadRegistrationsTable();
            loadDashboardData();

            showAlert('Event deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting event:', error);
            showAlert('Error deleting event. Please try again.', 'error');
        }
    }
}

// Delete registration
function deleteRegistration(registrationId) {
    if (confirm('Are you sure you want to delete this registration?')) {
        const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
        const updatedRegistrations = registrations.filter(reg => reg.id !== registrationId);
        localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));

        showAlert('Registration deleted successfully', 'success');
        loadRegistrationsTable();
        loadDashboardData();
    }
}

// Delete category
function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        const updatedCategories = categories.filter(category => category.id !== categoryId);
        localStorage.setItem('categories', JSON.stringify(updatedCategories));

        // Update events with this category to 'Uncategorized'
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const categoryToDelete = categories.find(category => category.id === categoryId);
        if (categoryToDelete) {
            events.forEach(event => {
                if (event.category === categoryToDelete.name) {
                    event.category = 'Uncategorized';
                }
            });
            localStorage.setItem('events', JSON.stringify(events));
        }

        showAlert('Category deleted successfully', 'success');
        loadCategoriesTable();
        loadEventsTable();
        loadDashboardData();
    }
}

// View event details
function viewEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(e => e.id === eventId);
    if (event) {
        alert(`Event Details:\nTitle: ${event.title}\nCategory: ${event.category}\nDate: ${formatDate(event.date)}\nLocation: ${event.location}\nDescription: ${event.description}\nCreated By: ${event.createdBy}`);
    }
}

// View user details
function viewUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    if (user) {
        alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nLocation: ${user.location || 'Not specified'}\nRole: ${user.isAdmin ? 'Admin' : 'User'}\nJoined: ${formatDate(user.joinedDate)}`);
    }
}

// Edit user
function editUser(userId) {
    // To be implemented
    showAlert('Edit user functionality coming soon', 'info');
}

// Edit event
function editEvent(eventId) {
    // To be implemented
    showAlert('Edit event functionality coming soon', 'info');
}

// Edit category
function editCategory(categoryId) {
    // To be implemented
    showAlert('Edit category functionality coming soon', 'info');
}

// Show alert
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `admin-alert admin-alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAdminPanel);