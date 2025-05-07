'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Tags table
    await queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create TodoTags junction table
    await queryInterface.createTable('TodoTags', {
      todoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Todos',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Tags', ['name']);
    await queryInterface.addIndex('TodoTags', ['todoId']);
    await queryInterface.addIndex('TodoTags', ['tagId']);
    await queryInterface.addConstraint('TodoTags', {
      fields: ['todoId', 'tagId'],
      type: 'primary key',
      name: 'TodoTags_pkey'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TodoTags');
    await queryInterface.dropTable('Tags');
  }
}; 