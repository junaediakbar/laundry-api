const jwt = require('jsonwebtoken');
const { tbl_akun: tblAkun, dataPerson } = require('../app/models');
const dotenv = require('dotenv');
dotenv.config();
const auth = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    // const token = bearerToken.split('Bearer')[1];
    if (!bearerToken) {
      return res.status(401).json({
        status: 'failed',
        message: 'Required authorization',
      });
    }
    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, user) => {
      console.log(err);

      if (err) return res.sendStatus(403);

      req.user = user;

      next();
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 'failed',
      message: 'Invalid token',
    });
  }
};
module.exports = auth;
