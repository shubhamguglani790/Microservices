const express = require('express');
const User = require('./database');

const app = express();
const port = 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.json(users); // Send JSON response
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//add user
app.post('/users/add', async (req, res) => {
    try {
        const { name, age, email } = req.body;

        if (!name || !age || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newUser = new User({ name, age, email });
        await newUser.save();

        console.log("User added successfully:", newUser);
        res.status(201).json({ message: "User saved successfully!", user: newUser });

    } catch (error) {
        console.error("Error adding user:", error.message);

        // ✅ Check for duplicate email error
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).json({ error: "Duplicate email" });
        }

        // Handle MongoDB validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Validation Error", details: error.errors });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});



//update user
app.put('/users/update', async (req, res) => {
    try {
        const { email, name, age } = req.body;

        // Check if the email is provided
        if (!email) {
            return res.status(400).json({ error: "User email is required" });
        }

        // Find and update user by email
        const user = await User.findOneAndUpdate(
            { email }, // Find user by email
            { name, age }, // Update fields
            { new: true, runValidators: true } // Return updated user & validate input
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" }); // No "details" field
        }

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//delete user
app.delete('/users/delete', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is provided
        if (!email) {
            return res.status(400).json({ error: "User email is required" });
        }

        // Find and delete user by email
        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: `${user.name} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});





app.listen(port, () => {
    console.log(`Userservices is running on http://localhost:${port}`)
});