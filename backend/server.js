const app = require('./app');
const { initDB } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log('Initializing database...');
    await initDB();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API endpoints available at:`);
      console.log(`- GET /api/test`);
      console.log(`- GET /api/users`);
      console.log(`- GET /api/users/:userId/todos`);
      console.log(`- GET /api/todos`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
