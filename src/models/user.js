

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 firstName: {
    type: String,
    required: true,
    minlength: 4
 },
 lastName: {
    type: String,
    
 },
 emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    
 },
    password: {
        type: String,
        required: true
        
    },

    age: {
        type: Number,
        min: 18,
        required: true
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
        required: true
    },

    photourl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"},

    about: {
        type: String,
        default: "This is a default about section.",
    },

    skills: {
        type: [String],
    },
},
{
timestamps: true,
}
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
