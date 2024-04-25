const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://sreeharim2022csbs:dbsreehari@backend.qqizzae.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const carSchema = new mongoose.Schema({
    name: String,
    Picture__c: String,
    Available_For_Rent__c: Boolean,
    Per_Day_Rent__c: Number,
    Mileage__c: Number
});
const NFT = mongoose.model('NFT', carSchema);

// Routes
app.get('/api/NFT', async (req, res) => {
    try {
        const NFT = await NFT.find();
        res.json(NFT);
        console.log("Fetching success");
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error'});
    }
});

// Rent route
app.post('/api/rent', async (req, res) => {
    const { username } = req.body;
    try {
        // Update the car's availability and set booked_by field
        await NFT.findByIdAndUpdate(carId, { Available_For_Rent__c: false, booked_by: username });
        res.json({ message: 'NFT rented successfully' });
    } catch (error) {
        console.error('Error renting car:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Signup route
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user document
        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Rent route

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
