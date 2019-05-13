const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check')
const config = require('config');
const jwt = require('jsonwebtoken');
//private access
router.get('/api/auth', auth, async (req, res) => {
    try {
        const user = User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});



//@route Post /api/login
//Login  public access
router.post('/', [
    check('email', "Email not valid").isEmail(),
    check('password', 'Provide Password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        //user exist or not
        if (!user) {
            res.status(400).json({ msg: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).send({ msg: "Invalid Credentials" });
        }

        const payLoad = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payLoad, config.get('jwtSecret'), (err, token) => {
            if (err) throw err;
            res.send({ token });
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
})

module.exports = router;