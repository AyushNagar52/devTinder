const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://ayushnagar5350_db_user:23eucei008@ayushnode.b2lc2w0.mongodb.net/devTinder");

};

module.exports = connectDB;



