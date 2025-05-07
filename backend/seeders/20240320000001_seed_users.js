'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        username: 'alice',
        email: 'alice@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'david',
        email: 'david@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'emma',
        email: 'emma@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
}; 