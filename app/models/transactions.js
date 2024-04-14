'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.belongsTo(models.accounts, { foreignKey: 'fkAuthor' });
    }
  }
  transactions.init(
    {
      transactionId: DataTypes.STRING,
      notaId: DataTypes.STRING,
      weight: DataTypes.STRING,
      service: DataTypes.STRING,
      price: DataTypes.STRING,
      amountPayment: DataTypes.STRING,
      perprice: DataTypes.STRING,
      name: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      address: DataTypes.STRING,
      createdBy: DataTypes.STRING,
      cashier: DataTypes.STRING,
      fkAuthor: DataTypes.INTEGER,
      dateIn: DataTypes.DATE,
      dateDone: DataTypes.DATE,
      datePayment: DataTypes.DATE,
      dateOut: DataTypes.DATE,
      status: DataTypes.STRING,
      notes: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'transactions',
    }
  );
  return transactions;
};
