const express = require("express");
const connectDB = require ("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {

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

app.get("/profile", userAuth, async (req, res) => {
   try{
    const user = req.user;

    res.send(user);
    }  catch (err) {
        res.status(400).send("Error: " + err.message);
    }  
});

// Get user by email 
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

   try {
    console.log("userEmail", userEmail);
     const users =  await User.findOne({ emailId: userEmail });
     res.send(users);
     
    // if(user.length === 0){
    //     return res.status(404).send("User not found");
    // }
   //  res.send(users);}
   
    } catch (err) {
        res.status(400).send("Error fetching the user:" + err.message);
    }
})

// feed API - GET/FEED - get all the users from the database
app.get("/feed", async (req, res) => {
});

// delete a user from the database 
app.delete("/user", async (req, res) => {
    const _id = req.body._id;

    try {
        const user = await User.findByIdAndDelete(_id);

        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message);
    }
});

// Update data of the user
app.patch("/user/:_id", async (req, res) => {
    const _id = req.params?._id;
    const data = req.body;
    try {

        const ALLOWED_UPDATES = ["password",
     "photourl", 
     "about", 
     "gender", 
     "skills",
     "age"
      ];   

const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
);

if (!isUpdateAllowed) {
    throw new Error("Update is not allowed ");
}

 if (Array.isArray(data.skills) && data.skills.length > 10) {
    throw new Error("Skills cannot be more than 10");
}

        const user = await User.findByIdAndUpdate({_id}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;

    // Sending a connection request logic here
    console.log("Sending a connection request");

    res.send("Connection request sent successfully");
});

connectDB()
.then(() => {
    console.log("Database connection is established");
app.listen(7777, () => {
    console.log("server is successfully running on port 7777");
})
})
.catch((err) => {
    console.log(" Database connection is not established", err);
});   

