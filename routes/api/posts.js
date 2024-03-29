const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');

// create a post
router.post('/', [ auth, [check('text', 'text required').not().isEmpty()] ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

// get post using id
router.get('/:id', auth, async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'post not found'})
        }
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router;