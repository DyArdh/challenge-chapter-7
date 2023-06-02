const express = require('express');
const router = express.Router();

const users = require('../controllers/users');
const multer = require('../middleware/multer');
const auth = require('../middleware/auth');

router.get('/', auth.auth, users.getUser);
router.post('/upload', auth.auth, multer.image.single('profile_img'), users.uploadProfileImg);

module.exports = router;
