const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const {
  check,
  validationResult
} = require("express-validator/check");
//@route Get /api/users/test
//test
router.get("/test", (req, res) => {
  res.json({
    msg: "users work"
  });
});

//@route Post /api/users/register
//register
router.post("/register", [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please provide valid email').isEmail(),
  check('password', "Password should be more than 6 Characters").isLength({
    min: 6
  })
], async (req, res) => {
  const errors = validationResult(req);
  const {
    name,
    email,
    password
  } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    //check user exist
    let user = await User.findOne({
      email
    });
    if (user) {
      return res.status(400).json({
        errors: [{
          msg: "User already exist"
        }]
      })
    }
    //get user gravatar

    //encrypt password
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
    //return jsonwebtoken
  } catch (err) {

  }
});

//@route Post /api/users/login
//Login  public access
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //console.log(email+" "+password)
  //find user from MONGODB
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        email: "User not found"
      });
    }

    //if found check the password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        //jwt token
        jwt.sign(
          payload,
          keys.SecretORKey, {
            expiresIn: 36000
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        res.status(400).json({
          password: "Password not match"
        });
      }
    });
  });
});

//@route get /api/users/current
//Login  private access
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json({
      id: res.user.id
    });
  }
);

module.exports = router;