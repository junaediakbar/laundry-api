const router = require('express').Router();
const auth = require('../../middleware/auth');
const upload = require('../../middleware/uploader');
const { login, register, info } = require('../controllers/acccountController');

router.post('/login', login);
router.post('/register', register);
router.get('/info', auth, info);

module.exports = router;
