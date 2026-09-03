const express = require('express');

const app = express();

const adminAuth = require('./middleware/auth');   

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Ayush", lastName: "Nagar" });
});   

// app.use((req, res) =>  {
//   res.send("Hello from the server!");
// });



app.listen(3000, () => {
  console.log("Server is successfully listenin on port 3000");
});