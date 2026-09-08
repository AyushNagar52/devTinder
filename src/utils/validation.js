const validator = require("validator");



const validateSignupData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    }
    else if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }
};
module.exports = { validateSignupData };