module.exports = (err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  });
  
  // Determine appropriate status code
  const statusCode = err.statusCode || 500;
  
  // Send detailed error in development, simplified in production
  const response = {
    error: err.message || 'Internal Server Error',
    status: statusCode,
    path: req.path
  };
  
  res.status(statusCode).json(response);
};