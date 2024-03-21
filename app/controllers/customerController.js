const { customers, accounts } = require('../models');
const ApiError = require('../../utils/ApiError');

const getAllCustomers = async (req, res) => {
  const { role } = req.user || {};
  const { limit, page, sortBy, sortType, isExport } = req.query;

  try {
    if (role === 1) {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    const limitFilter = Number(limit ? limit : 10);
    const pageFilter = Number(page ? page : 1);
    const isExportFilter = Boolean(isExport);

    const filter = {
      limit: limitFilter,
      offset: (pageFilter - 1) * limitFilter,
      order: [[sortBy || 'id', sortType || 'DESC']],
    };

    const data = await customers.findAll(isExportFilter ? {} : filter);

    const total = await customers.count(filter);

    res.status(200).json({
      message: 'Data berhasil didapatkan.',
      data: {
        data,
        total,
        currentPages: Number(page),
        limit: Number(limit),
        maxPages: Math.ceil(total / Number(limit)),
        from: Number(page) ? (Number(page) - 1) * Number(limit) + 1 : 1,
        to: Number(page)
          ? (Number(page) - 1) * Number(limit) + data.length
          : data.length,
        sortBy: sortBy || 'id',
        sortType: sortType || 'DESC',
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const addCustomer = async (req, res) => {
  const { role } = req.user || {};
  const { name, noTelp, address, dateIn, dateDone, weight, service, price } =
    req.body;
  try {
    if (role === 1) {
      console.log('USER', req.user);
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    const data = await customers.create({
      name: name,
      noTelp: noTelp,
      address: address,
    });
    res.status(200).json({
      message: 'Data berhasil ditambahkan.',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

module.exports = { getAllCustomers, addCustomer };
