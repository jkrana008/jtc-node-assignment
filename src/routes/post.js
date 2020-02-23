const express = require('express');
const controller = require('../controllers/post');
const router = express.Router({});

router.post('/', controller.create);
router.get('/', controller.read);
router.patch('/upvote', controller.upvote);

module.exports = router;
