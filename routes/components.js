const express = require('express');
const router = express.Router();

const components = require('../controllers/components');
const auth = require('../middleware/auth');

router.get('/', auth.auth, components.index);
router.post('/', auth.auth, auth.is_admin, components.store);
router.get('/:componentId', auth.auth, auth.is_admin, components.show);
router.put('/:componentId', auth.auth, auth.is_admin, components.update);
router.delete('/:componentId', auth.auth, auth.is_admin, components.destroy);

module.exports = router;
