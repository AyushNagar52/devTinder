const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
    try {

// Validation of Data
validateSignupData(req);
const { firstName, lastName, emailId, password, age, gender, } = req.body;


// Encrypt the password
const passwordHash = await bcrypt.hash(password, 10);
console.log("passwordHash", passwordHash);


// Create a new user instance and save it to the database
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash, 
            age,
            gender,
        });

        

        await user.save()
        res.send("User added successfully");
        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
});

authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

        // Create JWT token and send it to the user
        
        const token = await user.getJWT();


        // Add the Token to cookie and send it to the user
        res.cookie("token", token);


            res.send("Login successful!!!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }   
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful!!");
});

module.exports = authRouter;

