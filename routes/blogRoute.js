const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAllBlogs);
router.post('/', blogController.createBlog);
router.get('/new', blogController.getBlogForm);

module.exports = router;
