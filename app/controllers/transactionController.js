const { transactions, accounts } = require('../models');
const ApiError = require('../../utils/ApiError');

const getAllTransactions = async (req, res) => {
  const { role } = req.user || {};
  const { limit, page, sortBy, sortType, authorId, isExport } = req.query;

  try {
    if (role === 1) {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    const limitFilter = Number(limit ? limit : 10);
    const pageFilter = Number(page ? page : 1);
    const isExportFilter = Boolean(isExport);

    const filter = {
      include: [
        {
          model: accounts,
        },
      ],
      limit: limitFilter,
      offset: (pageFilter - 1) * limitFilter,
      order: [[sortBy || 'dateIn', sortType || 'DESC']],
    };
    if (authorId) {
      filter.where = {
        fkAuthor: authorId,
      };
    }

    const data = await transactions.findAll(
      isExportFilter
        ? {
            include: [
              {
                model: accounts,
              },
            ],
          }
        : filter
    );

    const total = await transactions.count(filter);

    res.status(200).json({
      message: 'Data berhasil didapatkan.',
      data: data,
      total,
      currentPages: Number(page),
      limit: Number(limit),
      maxPages: Math.ceil(total / Number(limit)),
      from: Number(page) ? (Number(page) - 1) * Number(limit) + 1 : 1,
      to: Number(page)
        ? (Number(page) - 1) * Number(limit) + data.length
        : data.length,
      sortBy: sortBy || 'dateIn',
      sortType: sortType || 'DESC',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const addTransaction = async (req, res) => {
  const { role } = req.user || {};
  const { name, noTelp, address, dateIn, dateDone, weight, service, price } =
    req.body;
  try {
    if (role === 1) {
      console.log('USER', req.user);
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    console.log(req.user);
    const data = await transactions.create({
      transactionId: 'N' + Date.now(),
      notaId: 'N' + Date.now(),
      weight: weight,
      service: service,
      price: price,
      name: name,
      noTelp: noTelp,
      address: address,
      createdBy: req.user.name,
      fkAuthor: req.user.id,
      dateIn: dateIn,
      dateDone: dateDone,
      dateOut: null,
      status: 'Diterima',
      deletedAt: null,
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

module.exports = { getAllTransactions, addTransaction };
