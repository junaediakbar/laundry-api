const Sequelize = require('sequelize');
const { transactions, accounts } = require('../models');
const { postActivity } = require('./activityController');
const ApiError = require('../../utils/ApiError');

const Op = Sequelize.Op;

const getAllTransactions = async (req, res) => {
  const { role } = req.user || {};
  const { limit, page, sortBy, sortType, param } = req.query;

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

const StatusPembayaran = Object.freeze({
  LUNAS: 'lunas',
  BELUM_BAYAR: 'belum-bayar',
  BAYAR_SEBAGIAN: 'bayar-sebagian',
});

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
    status,
    price,
    cashier,
    notes = '',
  } = req.body;

  try {
    const data = await transactions
      .create({
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
        dateOut: null,
        dateDone: dateDone,
        datePayment:
          status == StatusPembayaran.BELUM_BAYAR || status == null
            ? null
            : dateDone,
        status: status,
        notes: notes,
        cashier: cashier,
        deletedAt: null,
      })
      .then(
        async (res) =>
          await postActivity({
            name: cashier,
            action: 'add-transaction',
            notaId: notaId,
          })
      );
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

const takeTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    await transactions.update(
      { dateDone: Sequelize.fn('NOW') },
      { where: { id } }
    );
    const updated = await transactions.findOne({ where: { id } }).then(
      async (res) =>
        await postActivity({
          name: res.name,
          action: 'take-out-transaction',
          notaId: res.notaId,
        })
    );
    res.status(200).json({
      message: 'Berhasil Diambil',
      data: updated,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
const payTransactionById = async (req, res) => {
  const { id } = req.params;
  const { cashier } = req.body;
  try {
    await transactions.update(
      { datePayment: Sequelize.fn('NOW'), status: StatusPembayaran.LUNAS },
      { where: { id } }
    );
    const updated = await transactions.findOne({ where: { id } }).then(
      async (res) =>
        await postActivity({
          name: cashier,
          action: 'pay-transaction',
          notaId: res.notaId,
        })
    );
    res.status(200).json({
      message: 'Berhasil update data pembayaran',
      data: updated,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const editTransactionById = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    noTelp,
    address,
    notes,
    weight,
    service,
    price,
    status,
    cashier,
    notaId,
    dateIn,
    dateDone,
    datePayment,
    dateOut,
  } = req.body;
  try {
    await transactions.update(
      {
        name: name,
        noTelp: noTelp,
        address: address,
        notes: notes,
        weight: weight,
        service: service,
        price: price,
        status: status,
        cashier: cashier,
        notaId: notaId,
        dateIn: dateIn,
        dateOut: dateOut,
        dateDone: dateDone,
        datePayment: datePayment,
      },
      { where: { id } }
    );
    const updated = await transactions.findOne({ where: { id } }).then(
      async (res) =>
        await postActivity({
          name: cashier,
          action: 'edit-transaction',
          notaId: res.notaId,
        })
    );
    res.status(200).json({
      message: 'Berhasil mengubah data transaksi',
      data: updated,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const getTransactionById = async (req, res) => {
  const { id } = req.params;
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

const deleteTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    await transactions.destroy({ where: { id } }).then(
      async (res) =>
        await postActivity({
          name: 'admin',
          action: 'delete-transaction',
          notaId: res.notaId,
        })
    );
    res.status(200).json({
      message: 'Berhasil menghapus transaksi',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
  getTransactionById,
  takeTransactionById,
  payTransactionById,
  deleteTransactionById,
  editTransactionById,
};
