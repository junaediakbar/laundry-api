const router = require('express').Router();
const auth = require('../../middleware/auth');
const upload = require('../../middleware/uploader');
const { login, register } = require('../controllers/acccountController');

router.post('/login', login);
router.post('/register', register);
router.post('/me', register);

module.exports = router;
