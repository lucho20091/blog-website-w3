const express = require('express');
const router = express.Router();
const adminController= require('../../controllers/adminController');

router.get('/admin', adminController.admin_index);
router.post('/admin', adminController.admin_login);
router.post('/register', adminController.admin_register);
router.get('/dashboard', adminController.authMiddleware, adminController.admin_dashboard);
router.get('/add-post', adminController.authMiddleware, adminController.admin_add_post_get);
router.post('/add-post', adminController.authMiddleware, adminController.admin_add_post_post);
router.get('/edit-post/:id', adminController.authMiddleware, adminController.admin_edit_post_get);
router.put('/edit-post/:id', adminController.authMiddleware, adminController.admin_edit_post_put);
router.delete('/delete-post/:id', adminController.authMiddleware, adminController.admin_delete_post);
router.get('/logout', adminController.admin_logout);


module.exports = router;
