const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const User = require('./models/User');

// Dotenv (.env) files contain sensitive keys
dotenv.config();

// Attempt to connect to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // exit the process if db fails to connect
  }
})();

// Retrieve 
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

// Initialize Express.js app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.get('/test', (req, res) => {
    res.json('test ok');
});

// Form submitted from UserContext.jsx 
app.get('/profile', (req, res) => {
    // Check if user is storing login cookie containing token 
    const token = req.cookies?.token;

    // If user has cookie, verify using JSON Web Token secrey key and 
    //  respond to front end with user data {username, userID}
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
       // If user has no token, then they are not logged in and respond 
       //  to front end with HTTP status of '401 Unauthorized'
       res.status(401).json('no token'); 
    }
});

// Form submitted from RegisterAndLoginForm.jsx when user logs in
app.post('/login', async (req, res) => {
    // Retrieve username and password input by user
    const {username, password} = req.body;

    // Find user in database; if not found, do nothing
    const foundUser = await User.findOne({username});

    // Login user
    if (foundUser) {
        // Decrypt hashed password
        const passOk = bcrypt.compareSync(password, foundUser.password);

        // If password matches, sign JSON Web Token and respond to front end with 
        //  a cookie containing token that 'logs in' user
        if (passOk) {
            jwt.sign({userId:foundUser._id, username}, jwtSecret, {}, (err, token) => {
                res.cookie('token', token, {sameSite: 'none', secure: true}).json({
                    id: foundUser._id,
                });
            });
        }
    }
});

// Form submitted from RegisterAndLoginForm.jsx when user registers
app.post('/register', async (req, res) => {
    // Retrieve username and password input by user
    const {username, password} = req.body;

    // Create user
    try {
        // Hash password using bcrypt Salt key generated earlier
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        
        // Create user
        const createdUser = await User.create({
            username:username,
            password:hashedPassword
            
        });

        // Sign JSON Web Token with secret key and respond to front end with cookie 
        //  containing token and HTTP status of '201 Created'
        jwt.sign({userId: createdUser._id, username}, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {sameSite: 'none', secure: true}).status(201).json({
                id: createdUser._id,
            });
        });
    } catch(err) {
        // If User create promise rejects (fails to create User), then respond with
        //  HTTP status '500 Internal Server Error'
        if (err) throw err;
        res.status(500).json('error');
    }
});

// Host server on localhost:4040
app.listen(4040);