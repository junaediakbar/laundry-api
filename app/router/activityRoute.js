const router = require('express').Router();
const auth = require('../../middleware/auth');
const { getAllActivities } = require('../controllers/activityController');

router.get('/activities', auth, getAllActivities);

module.exports = router;
