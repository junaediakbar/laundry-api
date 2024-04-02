const router = require('express').Router();
const auth = require('../../middleware/auth');
const {
  getAllTransactions,
  addTransaction,
  getTransactionById,
  takeTransactionById,
  payTransactionById,
  deleteTransactionById,
  editTransactionById,
} = require('../controllers/transactionController');

router.get('/transaction', auth, getAllTransactions);
router.post('/transaction', auth, addTransaction);
router.get('/transaction/:id', auth, getTransactionById);
router.put('/transaction/take/:id', auth, takeTransactionById);
router.put('/transaction/pay/:id', auth, payTransactionById);
router.put('/transaction/:id', auth, editTransactionById);
router.delete('/transaction/:id', auth, deleteTransactionById);

// router.post('/transaction', addTransaction);

module.exports = router;
