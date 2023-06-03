const express = require('express');
const router = express.Router();

const products = require('../controllers/products');
const auth = require('../middleware/auth');

router.get('/', auth.auth, products.index);
router.post('/', auth.auth, auth.is_admin, products.store);
router.get('/:productId', auth.auth, auth.is_admin, products.show);
router.put('/:productId', auth.auth, auth.is_admin, products.update);
router.delete('/:productId', auth.auth, auth.is_admin, products.destroy);

module.exports = router;
