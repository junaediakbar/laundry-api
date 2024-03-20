const { transactions, accounts } = require('../models');

const getAllTransactions = async (req, res) => {
  const { role } = req.user || {};
  const { limit, page, sortBy, sortType, authorId, isExport } = req.query;

  try {
    if (role === 0) {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const limitFilter = Number(limit);
    const pageFilter = Number(page);
    const isExportFilter = Boolean(isExport);

    const filter = {
      include: [
        {
          model: accounts,
          as: 'accounts',
        },
      ],
      limit: limitFilter,
      offset: (pageFilter - 1) * limitFilter,
      order: [[sortBy || 'dateIn', sortType || 'ASC']],
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
                as: 'accounts',
              },
            ],
          }
        : filter
    );

    const total = await transactions.count(filter);

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
        sortBy: sortBy || 'dateIn',
        sortType: sortType || 'ASC',
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

module.exports = { getAllTransactions };
