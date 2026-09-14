const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name must be between 4 and 50 characters");
    } else if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password (minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol)");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "photourl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).length > 0 && 
        Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isEditAllowed;
};

const validatePasswordUpdate = (req) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new Error("Current password and new password are required");
    }

    if (currentPassword === newPassword) {
        throw new Error("New password cannot be the same as the current password");
    }

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("New password must be strong (minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol)");
    }
};

module.exports = {
    validateSignupData,
    validateEditProfileData,
    validatePasswordUpdate,
};