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

// delete a user from the database 
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
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {

        const ALLOWED_UPDATES = ["password",
     "photourl", 
     "about", 
     "gender", 
     "skills",
      ];   

const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
);

if (!isUpdateAllowed) {
    throw new Error("Update is not allowed ");
}

 if (data?.skills.length > 10) {
    throw new Error("Skills cannot be more than 10");
}

        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
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



