var mock = exports;

mock.route = (req, res) => {
  res.send({mock: true});
};