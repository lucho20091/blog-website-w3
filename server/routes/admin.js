const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Post = require('../model/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/admin');
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.redirect('/admin');
    }
}

router.get('/admin', (req, res) => {
    res.render('admin/index', { currentRoute: '/admin' });
});

router.post('/admin', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', maxAge: 3600000 });
    res.redirect('/dashboard');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        if(error.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: 'User creation failed' });
        }
    }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
    try{
        const posts = await Post.find();
        res.render('admin/dashboard', { layout: adminLayout, posts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }

});

router.get('/add-post', authMiddleware, (req, res) => {
    res.render('admin/add-post', { layout: adminLayout });
});

router.post('/add-post', authMiddleware, async (req, res) => {
    try{
        const { title, body } = req.body;       
        const post = await Post.create({ title, body });
        res.redirect('/dashboard');
    } catch (error) {
        res.redirect('/dashboard');
    }
});

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('admin/edit-post', { layout: adminLayout, post });
});

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    const { title, body } = req.body;
    console.log(title, body)
    const post = await Post.findByIdAndUpdate(req.params.id, { title, body }, { new: true });
    res.redirect('/dashboard');
});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try{   
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
        res.redirect('/dashboard');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


module.exports = router;
