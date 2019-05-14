const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const Profile = require('../../model/Profile');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
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

//@route post /api/profile
//add or update user's profile
//private
router.post('/', [auth, [
    check('status', "Status is required").not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedIn,
        instagram
    } = req.body;
    //Built profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    //built social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedIn) profileFields.social.linkedIn = linkedIn;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        //update profile
        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

            return res.json(profile);
        }


        //create profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.log(err.message);
        res.status(500).json('Server error');
    }

});


//@route get /api/profile
//get all profiles
//public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    } catch (err) {
        console.log(err.message);
        res.status(500).json('Server Error')
    }
})

//@route get /api/profile/user/user_id
//get profile by ID
//public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.user_id).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(401).json('Profile not Found')
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(401).json('Profile not Found')
        }
        res.status(500).json('Server Error')
    }
});



module.exports = router 