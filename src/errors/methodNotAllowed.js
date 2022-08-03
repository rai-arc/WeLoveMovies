//This function runs on methods not meant to be run with the corresponding route

function methodNotAllowed(req, res) {
    next({
      status: 405,
      message: `${req.method} not allowed for ${req.originalUrl}`,
    });
  }
  
  module.exports = methodNotAllowed;