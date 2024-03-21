const router = require('express').Router();
const auth = require('../../middleware/auth');
const {
  getAllTransactions,
  addTransaction,
} = require('../controllers/transactionController');

router.get('/transaction', auth, getAllTransactions);
router.post('/transaction', auth, addTransaction);
// router.get('/transaction/detail/:id', auth, getTransactionById);
// router.post('/transaction', addTransaction);

module.exports = router;
