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
      transactions.belongsTo(models.accounts, {
        foreignKey: 'fkAuthor',
        onDelete: 'CASCADE',
      });
    }
  }
  transactions.init(
    {
      transactionId: DataTypes.STRING,
      notaId: DataTypes.STRING,
      name: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      address: DataTypes.STRING,
      createdBy: DataTypes.STRING,
      fkAuthor: DataTypes.INTEGER,
      dateIn: DataTypes.DATE,
      dateDone: DataTypes.DATE,
      dateOut: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'transactions',
    }
  );
  return transactions;
};
