//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
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
app.use(express.static("public"));
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
    const username = req.body.username;
    const password = req.body.password;
    // Email comes from the database field
    User.findOne( { email: username }, function(err,results) {
        if (!err) {
            if (results) {
                if (results.password === password) {
                    res.render("secrets");
                }
            }
        } else {
            console.log("Error: " + err);
        }
    });
});


// Register route
app.route("/register")
// Register route - Get Method
.get(function(req,res) {
    res.render("Register");
})
// Register route - Post Method
.post(function(req,res) {
    const email = req.body.username;
    const password = req.body.password;
    // New entry object
    const newUser = new User({
        email : email,
        password : password
    });
    // Create object -- shortcut to make and save
    User.create(newUser, function (err, results) {
        if (!err) {
            res.render("secrets");
            // res.send("Saved user to db: " + results);
            // console.log(results);
        } else {
            res.send("Error: " + err);
            console.log(err);
        }
    });
});

