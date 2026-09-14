const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");


// View profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// Edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
       if (!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request");
       }
const loggenInUser = req.user;

Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

await loggenInUser.save();

    res.json({
        message: '${loggedInUser.firstName}, your profile updated successfully'
    });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = profileRouter;
