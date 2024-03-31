'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    
    */
    const listCostumers = [];

    for (let i = 0; i < 50; i++) {
      listCostumers.push({
        name: faker.internet.userName(),
        address: faker.location.streetAddress(),
        noTelp: '08' + faker.string.numeric(10), // '04812',
      });
    }
    await queryInterface.bulkInsert('customers', [...listCostumers], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
