const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//@route Get /api/users/test
//test
router.get("/test", (req, res) => {
  res.json({ msg: "users work" });
});

//@route Post /api/users/register
//register
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exist" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route Post /api/users/login
//Login
router.post("/login",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    //console.log(email+" "+password)
    //find user from MONGODB
    User.findOne({email})
    .then(user=>{
        if(!user){
            return res.status(404).json({email:"User not found"})
        }

        //if found check the password
        bcrypt.compare(password,user.password)
        .then(isMatch=>{
            if(isMatch){
                res.json({msg:"success"})
            }else{
                res.status(400).json({password:"Password not match"})
            }
        })
    })
})

module.exports = router;
