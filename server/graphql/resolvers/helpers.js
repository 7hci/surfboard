module.exports.authenticate = credentials => credentials
  ? Promise.resolve()
  : Promise.reject(new Error('Not authorized to access this endpoint'));
