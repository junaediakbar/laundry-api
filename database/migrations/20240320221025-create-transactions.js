'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transactionId: {
        type: Sequelize.STRING,
      },
      notaId: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      noTelp: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.STRING,
      },
      fkAuthor: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'accounts',
          key: 'id',
          as: 'fkAuthor',
        },
      },
      dateIn: {
        type: Sequelize.DATE,
      },
      dateDone: {
        type: Sequelize.DATE,
      },
      dateOut: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  },
};
