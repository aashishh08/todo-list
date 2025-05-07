const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Tag = require('./Tag');
const Note = require('./Note');

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    validate: {
      isIn: [['low', 'medium', 'high']]
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  assignedUsers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['completed']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Associations
Todo.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Todo, { foreignKey: 'userId' });

Todo.belongsToMany(Tag, { through: 'TodoTags', foreignKey: 'todoId' });
Tag.belongsToMany(Todo, { through: 'TodoTags', foreignKey: 'tagId' });

Todo.hasMany(Note, { foreignKey: 'todoId' });
Note.belongsTo(Todo, { foreignKey: 'todoId' });

module.exports = Todo;
