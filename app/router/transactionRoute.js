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
  getNotaByTransactionId,
  getLatestNota,
  getInfoToday,
  getRecapByDate,
  getListDataBydate,
} = require('../controllers/transactionController');

router.get('/transaction', auth, getAllTransactions);
router.post('/transaction', auth, addTransaction);
router.get('/transaction/:id', auth, getTransactionById);
router.put('/transaction/take/:id', auth, takeTransactionById);
router.put('/transaction/pay/:id', auth, payTransactionById);
router.put('/transaction/:id', auth, editTransactionById);
router.delete('/transaction/:id', auth, deleteTransactionById);
router.get('/transaction/nota/:id', getNotaByTransactionId);
router.get('/transaction/recap/latest', auth, getLatestNota);
router.get('/transaction/info/today', auth, getInfoToday);
router.get('/transaction/recap/date', auth, getRecapByDate);
router.get('/transaction/recap/list-data', auth, getListDataBydate);

// router.post('/transaction', addTransaction);

module.exports = router;
