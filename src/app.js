const express = require("express");
const connectDB = require ("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);


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
