const express = require("express");
const app = express();
const users = require("./routes/apis/users");
const profile = require("./routes/apis/profile");
const posts = require("./routes/apis/posts");
const auth = require('./routes/apis/auth');
const bodyParser = require("body-parser");
const passport = require("passport");
const connectDB = require('./config/db');

//body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// //passport middleware
// app.use(passport.initialize());

// //passport config
// require("./config/passport")(passport);

let port = process.env.PORT || 5002;
app.listen(port, () => console.log(`Server running on ${port}`));

// const db = require("./config/keys").mongoURI;

//connect to mongodb 
connectDB();

//use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/auth", auth);