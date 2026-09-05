const express = require("express");
const connectDB = require ("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());


app.post("/signup", async (req, res) => {
        const user = new User(req.body);

        try {

        await user.save()
        res.send("User added successfully");

        } catch (err) {
            res.status(400).send("Error saving the user:" + err.message);
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

// delete user by id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);

        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message);
    }
});

// Update data of the user
app.patch("/user", async (req, res) => {
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate(data.userId, data, { new: true });
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message);
    }
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



