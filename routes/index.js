const express = require('express');
const router = express.Router();

const products = require('./products');
const components = require('./components');
const suppliers = require('./suppliers');
const users = require('./users');
const auths = require('./auths');

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to Akukin Company API',
    });
});

router.use('/products', products);
router.use('/components', components);
router.use('/suppliers', suppliers);
router.use('/auth', auths);
router.use('/profile', users);

module.exports = router;
