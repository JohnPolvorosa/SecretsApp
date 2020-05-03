const mongoose = require("mongoose");
// const md5 = require("md5");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require("mongoose-findorcreate");


// const encrypt = require("mongoose-encryption");

// Initialize Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String
});

// Passport thing
userSchema.plugin(passportLocalMongoose);

// OAuth
userSchema.plugin(findOrCreate);


// Mongoose Encryption, do this before model
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

// Export model
module.exports = mongoose.model("User", userSchema);