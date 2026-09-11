

const mongoose = require('mongoose');
const validator = require('validator');

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
    validate(value) {
        if (!value.includes("@")) {
            throw new Error("Email is not valid" + value);
        }
    },
    
 },
    password: {
        type: String,
        required: true,
        validator(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value);
            }
        },
        
    },

    age: {
        type: Number,
        min: 18,
        required: false,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
        required: false
    },

    photourl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid");
            }
        }
    },

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


userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", { 
            expiresIn: "1d" 
        });

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare("passwordInputByUser",
        passwordHash
    );
};

module.exports = mongoose.model("User", userSchema);

