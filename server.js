const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./routes/apis/users");
const profile = require("./routes/apis/profile");
const posts = require("./routes/apis/posts");
const bodyParser = require("body-parser");
const passport = require("passport");

//body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

let port = process.env.port || 5002;
app.listen(port, () => console.log(`Server running on ${port}`));

const db = require("./config/keys").mongoURI;

//connect to mongodb using mongoose
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.log(err);
  });

//use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);