const Sequelize = require('sequelize');
const { customers, accounts } = require('../models');
const ApiError = require('../../utils/ApiError');
const Op = Sequelize.Op;

const getAllCustomers = async (req, res) => {
  const { role } = req.user || {};
  const { limit, page, sortBy, sortType, isExport, param } = req.query;

  try {
    if (role === 'user') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    const limitFilter = Number(limit ? limit : 10);
    const pageFilter = Number(page ? page : 1);
    const isExportFilter = Boolean(isExport);
    const paramFilter = param || '';

    const filter = {
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${paramFilter}%` } },
          { noTelp: { [Op.like]: `%${paramFilter}%` } },
        ],
      },
      limit: limitFilter,
      offset: (pageFilter - 1) * limitFilter,
      order: [[sortBy || 'id', sortType || 'DESC']],
    };

    const data = await customers.findAll(isExportFilter ? {} : filter);

    const total = await customers.count(filter);

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
      sortBy: sortBy || 'id',
      sortType: sortType || 'desc',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const addCustomer = async (req, res) => {
  const { role } = req.user || {};
  const { name, noTelp, address } = req.body;
  try {
    if (role === 'user') {
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

const getCustomerById = async (req, res) => {
  const { id } = req.params;
  // const { role } = req.user || {};
  try {
    const data = await customers.findOne({
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

const deleteCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    await customers.destroy({ where: { id } });

    res.status(200).json({
      message: 'Berhasil menghapus Customer',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const editCustomerById = async (req, res) => {
  const { id } = req.params;
  const { name, noTelp, address } = req.body;
  try {
    await customers.update({ name, noTelp, address }, { where: { id } });
    const updatedCustomer = await customers.findOne({ where: { id } });
    res.status(200).json({
      message: 'Berhasil Merubah laporan tanam',
      data: updatedCustomer,
    });
  } catch {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllCustomers,
  addCustomer,
  getCustomerById,
  deleteCustomerById,
  editCustomerById,
};
