const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const oracledb = require('oracledb');

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Oracle Database Configuration
// Oracle Database Configuration
const dbConfig = {
  user: 'SYSTEM',
  password: 'Oracle123',
  connectString: 'localhost:1521/ORCLPDB'
};

// Serve static files from the public directory
///  'public' -> change if not working
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for user registration
///---s
// Server-side code
app.post('/addUser', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Connect to the Oracle database
    const connection = await oracledb.getConnection(dbConfig);

    // Insert user into the database
    await connection.execute(
      `INSERT INTO "SIGNUP" ("NAME", "EMAIL", "PASSWORD") VALUES (:name, :email, :password)`,
      [name, email, password]
    );

    // Commit the transaction
    await connection.commit();

    res.status(200).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).send('Error registering user');
  }
});



// Endpoint for user login
//---
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Connect to the Oracle database
    const connection = await oracledb.getConnection(dbConfig);

    // Query the database for the user
    // Query the database for the user
    const result = await connection.execute(
      `SELECT * FROM "SIGNUP" WHERE "EMAIL" = :email AND "PASSWORD" = :password`,
      [email, password]
    );


    // Release the connection
    await connection.commit();

    if (result.rows.length > 0) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).send('Error logging in');
  }
});

// Serve the registration page
app.get('/addUser', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'login.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'login.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});