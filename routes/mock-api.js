var mock = exports;

mock.route = (req, res, next) => {
  var mockResponse;


  switch(req.path) {
    case '/mock-api/admin/directory/v1/users':
      mockResponse = { id: "testid" };
      break;
    case '/mock-api/gmail/v1/users/me/messages/send':
      mockResponse = { id: "testid" };
      break;
    case '/mock-api/users.admin.invite':
      if(req.query.email === 'already.invited@7hci.com') {
        mockResponse = { ok: false };
      } else {
        mockResponse = { ok: true };
      }
      break;
  }
  res.send( mockResponse );
};