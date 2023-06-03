const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/google', auth.loginGoogle);
router.get('/activation-email', auth.verifyEmail);
router.post('/forgot-password', auth.forgotPassword);
router.get('/reset-password', auth.resetPasswordPage);
router.post('/reset-password', auth.resetPassword);

module.exports = router;
