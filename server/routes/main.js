const express = require('express');
const router = express.Router();
const mainController = require('../../controllers/mainController');


router.get('/', mainController.main_index);

router.get('/about', mainController.main_about);

router.get('/post/:id', mainController.main_post);

router.post('/search', mainController.main_search);

module.exports = router;


