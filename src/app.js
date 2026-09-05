const express = require("express");
const connectDB = require ("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());


app.post("/signup", async (req, res) => {
        const user = new User({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    emailId : req.body.emailId,
    password : req.body.password,
    age : req.body.age,
    gender : req.body.gender,
        });

        await user.save()

        res.send("User added successfully");

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



