const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const Profile = require('../../model/Profile');
const auth = require('../../middleware/auth')
//@route get /api/profile/me
//get current user's profile
//private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findById(req.user.id).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).send('No Profile Found');
        }
        res.json(profile)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router 