const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

// Initialize Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
// Mongoose Encryption, do this before model
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

// Export model
module.exports = mongoose.model("User", userSchema);