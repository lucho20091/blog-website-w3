const express = require('express');
const router = express.Router();
const adminLayout = '../views/layouts/admin'
const User = require('../models/User');

router.get('/admin', (req, res) => {
    res.render('admin/index', { layout: adminLayout });
});

module.exports = router;
