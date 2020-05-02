//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const sessions = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose
const mongoose = require("mongoose");
const encrypytion = require("mongoose-encryption");
// Initialize Mongoose
const mongoLocal = `mongodb://localhost:27017/userDB`
mongoose.connect(mongoLocal, {
    useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false
});



// Export Mongoose, Initialize Model
const User = require("./models/User");



// Server stuff

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

// Home route
app.route("/")
// Home route - Get Method
.get(function(req,res) {
    res.render("Home");
});

// Login route
app.route("/login")
// Login route - Get Method
.get(function(req,res) {
    res.render("Login");
})
// Login route - Post Method
.post(function(req,res) {
    // const username = req.body.username;
    // const password = req.body.password;
    // // Email comes from the database field
    // User.findOne( { email: username }, function(err,results) {
    //     if (!err) {
    //         if (results) {
    //             // Load hash from your password DB.
    //             bcrypt.compare(password, results.password, function(err, result) {
    //                 // result == true
    //                 if (result === true) {
    //                     res.render("secrets"); 
    //                 } else {
    //                     res.send("Invalid password");
    //                 }
    //             });
    //         }
    //     } else {
    //         console.log("Error: " + err);
    //     }
    // });
});


// Register route
app.route("/register")
// Register route - Get Method
.get(function(req,res) {
    res.render("Register");
})
// Register route - Post Method
.post(function(req,res) {
    // // BCRYPT
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     // Store hash in your password DB.
    //     const email = req.body.username;
    //     const password = hash;
    //     // New entry object
    //     const newUser = new User({
    //         email : email,
    //         password : password
    //     });
    //     // Create object -- shortcut to make and save
    //     User.create(newUser, function (err, results) {
    //         if (!err) {
    //             res.render("secrets");
    //             // res.send("Saved user to db: " + results);
    //             // console.log(results);
    //         } else {
    //             res.send("Error: " + err);
    //             console.log(err);
    //         }
    //     });
    // });

    
});

