const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { validationResult, check } = require('express-validator/check')
const Post = require('../../model/Post')
const Profile = require('../../model/Profile')
const User = require('../../model/User')

//@route post /api/posts
//post add post
//private
router.post('/', [auth,
    [
        check('text', "Text is Required").not().isEmpty()
    ]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ errors: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message)
            res.status(500).json('Server Error')
        }


        res.json({ msg: "posts work" })
    })

//@route get /api/posts
//get all posts
//private
router.get('/', auth, async (req, res) => {
    try {
        const post = await Post.find().sort({ date: -1 })//get recent post first(-1) else not required
        res.json(post)
    } catch (err) {
        console.error(err.message)
        res.status(500).json('Server Error')
    }
})

//@route get /api/posts/:id
//get posts by id
//private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(400).json('Post Not Found')
        }
        res.json(post)
    } catch (err) {
        if (err.kind === 'ObjectId') {
            res.status(400).json('Post Not Found')
        }
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

//@route delete /api/posts/:id
//delete post by id
//private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(400).json('Post not found');
        }
        //only user who posted the post can delete it

        if (!req.user.id === post.user.toString()) {
            res.status(400).json('User not authorized');
        }

        await post.remove();
        res.json('Post Removed')

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            res.status(400).json('Post Not Found')
        }
        res.status(500).json('Server Error');
    }
})

//@route put /api/posts/like/:id
//give like to post
//private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //check whether this post is already liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            res.status(400).json({ msg: 'Post is already liked' })
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post)
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error')
    }
})

//@route delete /api/posts/dislike/:id
//give dislike to post
//private
router.delete('/dislike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //check whether post is already disliked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            res.status(400).json({ msg: 'Post already disliked' })
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        // console.log(removeIndex)
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.send(post);

    } catch (err) {
        console.error(err);
        res.status(500).json('Server Error')
    }
})


//@route put /api/posts/comment/:id
//write comments to post
//private
router.put('/comment/:id', [auth,
    [check('text', "Comment is required").not().isEmpty()]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        try {

            const post = await Post.findById(req.params.id);
            const user = await User.findById(req.user.id).select('-password');


            const commentText = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            // //check for same comment
            // if (post.comments.filter(comment => comment.text === req.body.text).length > 0) {
            //     res.status(400).send('Same Comments cannot be added')
            // }
            post.comments.unshift(commentText);
            await post.save();

            res.json(post)
        } catch (err) {
            console.log(err);
            res.status(500).send('Server Error')
        }
    })

//@route delete /api/posts/comment/:id/:comment_id
//delete comments to post
//private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //pull out comment
        const comment = post.comments.find(comment => {
            return comment.id.toString() === req.params.comment_id
        })

        if (!comment) {
            res.status(400).send('Comment doesnot exist')
        }

        //check for authorized user
        if (comment.user.toString() !== req.user.id) {
            res.status(400).send('UnAuthorized User')
        }

        const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})
module.exports = router 