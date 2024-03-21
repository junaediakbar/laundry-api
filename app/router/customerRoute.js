const router = require('express').Router();
const auth = require('../../middleware/auth');
const {
  getAllCustomers,
  addCustomer,
} = require('../controllers/customerController');

router.get('/customer', auth, getAllCustomers);
router.post('/customer', auth, addCustomer);
// router.get('/transaction/detail/:id', auth, getTransactionById);
// router.post('/transaction', addTransaction);

module.exports = router;
