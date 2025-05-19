from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data for events
users =[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "securepassword",
        "confirm password": "securepassword",
        "role":"volunteer"
    },
    {
        "id":2,
        "name":"Anish",
        "email":"anishinamadar2004@gmail.com",
        "password": "securepassword",
        "confirm password": "securepassword",
        "role":"organiser"
    },
    {
        "id":3,
        "name":"xyz",
        "email":"temp@gmail.com",
        "password": "securepassword",
        "confirm password": "securepassword",
        "role":"participant"   
    }
]

# Endpoint to fetch all users
@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

# Endpoint to create a new users
@app.route('/users', methods=['POST'])
def create_users():
    new_users = request.json
    new_users['id'] = len(users) + 1  # Assign a new ID
    users.append(new_users)
    return jsonify(new_users), 201

# Endpoint to fetch a specific event by ID
@app.route('/users/<int:users_id>', methods=['GET'])
def get_users(users_id):
    users = next((users for users in users if users['id'] == users_id), None)
    if users is None:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(users)

# Endpoint to handle user login
@app.route('/auth/login', methods=['POST'])
def login():
    # Placeholder for login logic
    return jsonify({"message": "Login successful"}), 200

# Endpoint to handle user logout
@app.route('/auth/logout', methods=['POST'])
def logout():
    # Placeholder for logout logic
    return jsonify({"message": "Logout successful"}), 200

if __name__ == '__main__':
    app.run(debug=True)
