const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session'); // Import session package

const app = express();
const port = 3000;

// Middleware to handle static files
app.use(express.static(__dirname));

// Middleware for JSON parsing
app.use(bodyParser.json());

// Middleware for sessions
app.use(session({
  secret: 'secret-key', // Choose a secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Route to serve the index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data' });
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Set the session for the logged-in user
      req.session.username = user.username;
      res.json({ username: user.username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Route to handle logout
app.post('/logout', (req, res) => {
  // Destroy the session on logout
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Route to check session status (whether user is logged in)
app.get('/check-session', (req, res) => {
  if (req.session.username) {
    // User is logged in
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    // User is not logged in
    res.json({ loggedIn: false });
  }
});
//edited

app.post('/signup', (req, res) => {
  const { name, email, username, password } = req.body;
  const filePath = path.join(__dirname, 'users.json');

  // Read the file to fetch existing users
  fs.readFile(filePath, 'utf-8', (err, data) => {
    let users = [];
    if (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist, initialize users array
        users = [];
      } else {
        return res.status(500).json({ error: 'Error reading user data.' });
      }
    } else {
      try {
        users = JSON.parse(data).users || [];
      } catch (parseError) {
        return res.status(500).json({ error: 'Invalid JSON format in users.json.' });
      }
    }

    // Check if user exists (username or email must be unique)
    const userExists = users.some(u => u.username === username || u.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }

    // Add new user
    const newUser = { name, email, username, password }; // Full object with all fields
    users.push(newUser);

    // Write updated users back to the file
    fs.writeFile(filePath, JSON.stringify({ users }, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user data.' });
      }

      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

//selection script 




//selection script 
app.use(bodyParser.json());

// Serve static files for the HTML frontend
app.use(express.static('public'));

// Save event data to requirement.json
app.post('/save-requirements', (req, res) => {
  const eventData = req.body;

  // Define file path for requirement.json
  const filePath = path.join(__dirname, 'requirement.json');

  // Write data to requirement.json
  fs.writeFile(filePath, JSON.stringify(eventData, null, 2), (err) => {
    if (err) {
      console.error("Failed to save event data:", err);
      return res.status(500).json({ error: 'Failed to save event data' });
    }
    res.json({ message: 'Event details successfully saved!' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});











