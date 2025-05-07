'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, create some tags
    const tags = [
      { name: 'work', createdAt: new Date(), updatedAt: new Date() },
      { name: 'personal', createdAt: new Date(), updatedAt: new Date() },
      { name: 'urgent', createdAt: new Date(), updatedAt: new Date() },
      { name: 'meeting', createdAt: new Date(), updatedAt: new Date() },
      { name: 'project', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('Tags', tags, {});

    // Get the inserted tags
    const insertedTags = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Tags";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create sample todos
    const todos = [
      {
        title: 'Complete project proposal',
        description: 'Write and submit the project proposal document',
        priority: 'high',
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Schedule team meeting',
        description: 'Set up weekly team sync meeting',
        priority: 'medium',
        completed: false,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests',
        priority: 'high',
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        priority: 'low',
        completed: true,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Prepare presentation',
        description: 'Create slides for the client presentation',
        priority: 'medium',
        completed: false,
        userId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Todos', todos, {});

    // Get the inserted todos
    const insertedTodos = await queryInterface.sequelize.query(
      'SELECT id FROM "Todos";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create todo-tag associations
    const todoTags = [];
    insertedTodos.forEach((todo, index) => {
      // Assign 2-3 random tags to each todo
      const numTags = Math.floor(Math.random() * 2) + 2;
      const shuffledTags = [...insertedTags].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numTags; i++) {
        todoTags.push({
          todoId: todo.id,
          tagId: shuffledTags[i].id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    await queryInterface.bulkInsert('TodoTags', todoTags, {});

    // Create some sample notes
    const notes = [
      {
        content: 'Need to include budget estimates',
        todoId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: 'Check with team for availability',
        todoId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: 'Focus on critical security fixes first',
        todoId: 3,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Notes', notes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Notes', null, {});
    await queryInterface.bulkDelete('TodoTags', null, {});
    await queryInterface.bulkDelete('Todos', null, {});
    await queryInterface.bulkDelete('Tags', null, {});
  }
}; 