const { Router } = require('express');
const account = require('./accountRoute');
const transaction = require('./transactionRoute');
const customer = require('./customerRoute');
const router = Router();
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is running',
  });
});
router.use('/auth', account);
router.use('/', transaction);
router.use('/', customer);

module.exports = router;
