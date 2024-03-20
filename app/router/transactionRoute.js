const router = require('express').Router();
const auth = require('../../middleware/auth');
const { getAllTransactions } = require('../controllers/transactionController');

router.get('/transaction', auth, getAllTransactions);
// router.get('/transaction/detail/:id', auth, getTransactionById);
// router.post('/transaction', addTransaction);

module.exports = router;
