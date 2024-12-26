const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Read users data from a JSON file (or initialize if it doesn't exist)
function readUsersData() {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {}; // Return an empty object if file doesn't exist
    }
}

// Write users data to a JSON file
function writeUsersData(usersData) {
    fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2), 'utf8');
}

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read existing users data
    const usersData = readUsersData();

    // Check if the username exists and the password matches
    if (usersData[username] === password) {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Route to handle registration (adding new users)
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Read existing users data
    const usersData = readUsersData();

    // Add new user to the data
    if (usersData[username]) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Add username and password to the object
    usersData[username] = password;

    // Write updated data back to the file
    writeUsersData(usersData);

    res.json({ message: 'User registered successfully!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
