const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const Profile = require('../../model/Profile');
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
//@route get /api/profile/me
//get current user's profile
//private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findById(req.user._id).populate('user', ['name', 'avatar']);
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
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
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

//@route Delete /api/profile
//Delete profile,users & posts
//private
router.delete('/', auth, async (req, res) => {
    try {
        //delete profile
        await Profile.findOneAndDelete({ user: req.user.id });

        //delete user
        await User.findOneAndDelete({ _id: req.user.id });

        res.json({ msg: "User deleted" })
    } catch (err) {
        console.log(err.message);
        res.status(500).json('Server Error')
    }
})

//@route put /api/profile
//add experience
//private
router.put('/', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is Required').not().isEmpty(),
    check('from', 'From Date is Required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status('400').send({ errors: errors.array() })
    }
    try {
        const {
            title, company, location, from, to, current, description
        } = req.body;

        const userExp = {
            title, company, location, from, to, current, description
        }

        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(userExp);//unshift is used to add at the beginning
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err)
        res.status(500).json('Server Error')
    }
})

//@route delete /api/profile/experience/:exp_id
//delete experience
//private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.status(200).json(profile)
    } catch (err) {
        console.log(err.message);
        res.status(500).json('Server Error');
    }
})

//@route put /api/profile/education
//add education
//private
router.put('/education', [auth, [
    check('school', 'School is Required').not().isEmpty(),
    check('degree', 'Degree is Required').not().isEmpty(),
    check('fieldofstudy', "Field of study is required").not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
    check('to', 'to date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array() })
    }
    try {
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            description
        } = req.body;

        const userEducation = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            description
        }

        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(userEducation);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err)
        res.status(500).json('Server Error')
    }
})


//@route delete /api/profile/education/:edu_id
//delete education
//private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).json('Server Error')
    }
})

//@route get /api/profile/github/:username
//get user repos from github
//public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node js' }
        }
        request(options, (error, response, body) => {
            if (error) console.log(error)

            if (response.statusCode !== 200) {
                res.status(400).json('no Github User found')
            }

            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json('Server Error')
    }
})

module.exports = router 