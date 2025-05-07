const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { body } = require('express-validator');

// Validation middleware
const validateTodoInput = [
  body('title').notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('assignedUsers').optional().isArray().withMessage('Assigned users must be an array')
];

// Todo routes
router.get('/', todoController.getTodos);
router.get('/export', todoController.exportTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', validateTodoInput, todoController.createTodo);
router.put('/:id', validateTodoInput, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.post('/:todoId/notes', 
  body('content').notEmpty().withMessage('Note content is required'),
  todoController.addNoteToTodo
);

module.exports = router;
