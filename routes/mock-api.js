var mock = exports;

mock.route = (req, res, next) => {
  res.send({
    id: "testid",
    ok: "test"
  });
};