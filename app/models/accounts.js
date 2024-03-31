'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      accounts.hasMany(models.transactions, {
        foreignKey: 'fkAuthor',
      });
    }
  }
  accounts.init(
    {
      nik: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      role: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'accounts',
    }
  );
  return accounts;
};
