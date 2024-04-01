const Sequelize = require('sequelize');
const { transactions, accounts } = require('../models');
const ApiError = require('../../utils/ApiError');

const Op = Sequelize.Op;

const getAllTransactions = async (req, res) => {
  const { role } = req.user || {};
  const { limit, page, sortBy, sortType, authorId, param } = req.query;

  try {
    if (role === 1) {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    const limitFilter = Number(limit ? limit : 10);
    const pageFilter = Number(page ? page : 1);
    const paramFilter = param || '';
    const filter = {
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${paramFilter}%` } },
          { notaId: { [Op.like]: `%${paramFilter}%` } },
        ],
      },
      include: [],
      limit: limitFilter,
      offset: (pageFilter - 1) * limitFilter,
      order: [[sortBy || 'dateIn', sortType || 'DESC']],
    };
    // if (authorId) {
    //   filter.where = {
    //     fkAuthor: authorId,
    //   };
    // }

    const data = await transactions.findAll(filter);

    const total = await transactions.count(filter);

    res.status(200).json({
      message: 'Data berhasil didapatkan.',
      data: data,
      total,
      currentPages: pageFilter,
      limit: limitFilter,
      maxPages: Math.ceil(total / limitFilter),
      from: pageFilter ? (pageFilter - 1) * limitFilter + 1 : 1,
      to: pageFilter
        ? (pageFilter - 1) * limitFilter + data.length
        : data.length,
      sortBy: sortBy || 'dateIn',
      sortType: sortType || 'desc',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const addTransaction = async (req, res) => {
  const { role } = req.user || {};
  const {
    name,
    noTelp,
    notaId,
    address,
    dateIn,
    dateDone,
    weight,
    service,
    price,
    notes = '',
  } = req.body;
  try {
    if (role === 'user') {
      console.log('USER', req.user);
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    console.log(req.user);
    const data = await transactions.create({
      transactionId: 'N' + Date.now(),
      notaId: notaId,
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
      notes: notes,
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

const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user || {};
  const { name, noTelp, address } = req.body;
  try {
    const data = await transactions.findOne({
      where: { id },
    });
    res.status(200).json({
      message: 'Data berhasil didapatkan.',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

module.exports = { getAllTransactions, addTransaction, getTransactionById };
