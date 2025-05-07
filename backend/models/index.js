const sequelize = require('../config/db');
const User = require('./User');
const Todo = require('./Todo');
const Note = require('./Note');


const initDB = async () => {
  await sequelize.sync({ force: true });
  console.log('Database synced');
};

module.exports = { initDB, User, Todo, Note };
