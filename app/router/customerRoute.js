const router = require('express').Router();
const auth = require('../../middleware/auth');
const {
  getAllCustomers,
  addCustomer,
  getCustomerById,
  deleteCustomerById,
  editCustomerById,
} = require('../controllers/customerController');

router.get('/customer', auth, getAllCustomers);
router.post('/customer', auth, addCustomer);
router.get('/customer/:id', auth, getCustomerById);
router.put('/customer/:id', auth, editCustomerById);
router.delete('/customer/:id', auth, deleteCustomerById);
// router.get('/transaction/detail/:id', auth, getTransactionById);
// router.post('/transaction', addTransaction);

module.exports = router;
