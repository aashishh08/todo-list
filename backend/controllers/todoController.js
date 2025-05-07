const { Todo, Note, User } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Middleware to validate todo input
const validateTodo = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all todos for current user with pagination, filtering, and sorting
exports.getTodos = async (req, res) => {
  try {
    const userId = req.query.user;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Sorting parameters
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Filter parameters
    const where = { userId };
    if (req.query.status) where.completed = req.query.status === 'completed';
    if (req.query.priority) where.priority = req.query.priority;
    if (req.query.tags) {
      where.tags = {
        [Op.contains]: [req.query.tags]
      };
    }
    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    // Get total count for pagination
    const total = await Todo.count({ where });

    // Get todos with pagination, sorting, and filtering
    const todos = await Todo.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Note,
          attributes: ['id', 'content', 'createdAt'],
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    res.json({
      todos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Get a specific todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.user;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const todo = await Todo.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Note,
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description, priority, tags, assignedUsers } = req.body;
    const userId = req.query.user;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await Todo.create({
      title,
      description,
      priority,
      tags,
      assignedUsers,
      userId
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Update an existing todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.user;
    const updates = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.update(updates);
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.user;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// Add a note to a todo
exports.addNoteToTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { content } = req.body;
    const userId = req.query.user;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const todo = await Todo.findOne({ where: { id: todoId, userId } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const note = await Note.create({
      content,
      todoId,
      userId
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
};

// Export todos
exports.exportTodos = async (req, res) => {
  try {
    const userId = req.query.user;
    const format = req.query.format || 'json';

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const todos = await Todo.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Note,
          attributes: ['id', 'content', 'createdAt']
        }
      ]
    });

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(todos);
      res.header('Content-Type', 'text/csv');
      res.attachment('todos.csv');
      return res.send(csv);
    }

    // Default to JSON
    res.json(todos);
  } catch (error) {
    console.error('Error exporting todos:', error);
    res.status(500).json({ error: 'Failed to export todos' });
  }
};

// Helper function to convert todos to CSV
function convertToCSV(todos) {
  const headers = ['id', 'title', 'description', 'priority', 'completed', 'tags', 'createdAt', 'updatedAt'];
  const rows = todos.map(todo => {
    return [
      todo.id,
      todo.title,
      todo.description,
      todo.priority,
      todo.completed,
      todo.tags.join(';'),
      todo.createdAt,
      todo.updatedAt
    ];
  });

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
