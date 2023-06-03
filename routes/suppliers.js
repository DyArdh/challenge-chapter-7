const express = require('express');
const router = express.Router();

const suppliers = require('../controllers/suppliers');
const auth = require('../middleware/auth');

router.get('/', auth.auth, suppliers.index);
router.post('/', auth.auth, auth.is_admin, suppliers.store);
router.get('/:supplierId', auth.auth, auth.is_admin, suppliers.show);
router.put('/:supplierId', auth.auth, auth.is_admin, suppliers.update);
router.delete('/:supplierId', auth.auth, auth.is_admin, suppliers.destroy);

module.exports = router;
