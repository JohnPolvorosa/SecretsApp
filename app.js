//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

// Server use stuff
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Passport session intialize
app.use(session({
    secret: 'The big secret',
    resave: false,
    saveUninitialized: false
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Mongoose
const mongoose = require("mongoose");
const encrypytion = require("mongoose-encryption");
// Initialize Mongoose
const mongoLocal = `mongodb://localhost:27017/userDB`
mongoose.connect(mongoLocal, {
    useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
});


// Export Mongoose, Initialize Model
const User = require("./models/User");

// Passport with Mongoose in models
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
 

// SERIALIZE ERROR FIX - http://www.passportjs.org/docs/oauth2-api/
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// GOOGLE OAUTH
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    passReqToCallback   : true
  },
  // callback
  function(request, accessToken, refreshToken, profile, done) {
      console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));



// Home route
app.route("/")
// Home route - Get Method
.get(function(req,res) {
    res.render("Home");
});

// AUTH GOOGLE ROUTE
// app.route("/auth/google")
app.route("/auth/google")
// AUTH GOOGLE ROUTE - GET METHOD
.get(
    passport.authenticate("google", { scope: ["profile"]})
);

// AUTH GOOGLE ROUTE Authenticate
app.route("/auth/google/secrets")
.get(passport.authenticate( "google", {
    successRedirect: "/secrets",
    failureRedirect: "/login"
}));

// Secrets route
app.route("/secrets")
// Secrets route - Get Method
.get(function(req,res) {
    if (req.isAuthenticated()){
        res.render("secrets");
        // res.render("secrets");
    } else {
        console.log("User tried to access withtout authentication");
        res.redirect("/login");
    }
});


// Login route
app.route("/login")
// Login route - Get Method
.get(function(req,res) {
    res.render("Login");
})
// Login route - Post Method
.post(function(req,res) {

    // Setup user object
    const user = new User ({
        username : req.body.username,
        password: req.body.password
    });
    // Passport Login
    req.login(user, function(err) {
        if (err) {
            console.log("Error logging in : " + user.username);
            res.redirect("/login");
        } else {
            // res.redirect("/secrets");
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
            console.log("Logging in: " + user.username);
        }
    });



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
    const email = req.body.username;

    // Passport Register
    User.register({ username: email }, req.body.password, function(err, results) {
        // Authenticate using passport
        if (!err) {
            console.log("Successfully registed: " + email);
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        } else if (err) {
            console.log("Error registering: " + email + " " + err);
            res.redirect("/register");
        }
    });

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

// Logout route
app.route("/logout")
// Logout - GET METHOD
.get(function(req,res) {
        req.logout();
        res.redirect('/');
});


// Server stuff
app.listen(3000, function() {
    console.log("Server started on port 3000");
});