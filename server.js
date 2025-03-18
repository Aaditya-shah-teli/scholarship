const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const port = 3019;
const app = express();

// Middleware to serve static files
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/school', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection successful"))
    .catch(err => console.log("MongoDB connection failed:", err));

// Define schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    birth: { type: Date, required: true },
    email: { type: String, required: true, match: [/\S+@\S+\.\S+/, 'Please use a valid email address'] },
    number: { type: Number, required: true },
    gender: { type: String, required: true },
    grade: { type: Number, required: true },
    id: { type: Number, required: true },
    fatherName: { type: String, required: true },
    passDate: { type: String, required: true },
    password: { type: String, required: true } // Added password field
});

const Users = mongoose.model('data', userSchema);

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/post', async (req, res) => {
    try {
        // Log the incoming request data to debug
        console.log(req.body);

        const user = new Users({
            username: req.body.username,
            birth: req.body.birth,
            email: req.body.email,
            number: req.body.number,
            gender: req.body.gender,
            grade: req.body.grade,
            id: req.body.id,
            fatherName: req.body.fatherName,
            passDate: req.body.passDate,
            password: req.body.password
        });

        await user.save();
        console.log(user);
        res.send("User saved successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving user.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});