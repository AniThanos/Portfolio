const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');
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
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })

    user = new User({
      name,
      email,
      avatar,
      password
    })



    //encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    //return jsonwebtoken
    const payLoad = {
      user: {
        id: user.id
      }

    }

    jwt.sign(payLoad, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token })
    })

  } catch (err) {
    console.log(err.message)
  }
});

module.exports = router;