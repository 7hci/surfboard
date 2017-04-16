var express = require('express');;
var router = express.Router();

router.post('/admin/directory/v1/users', (req, res, next) => {
  res.send( { id: "testid" } );
});

router.post('/gmail/v1/users/me/messages/send', (req, res, next) => {
  res.send( { id: "testid" } );
});

router.post('/drive/v3/files', (req, res, next) => {
  res.send( { id: "testid_folder" } );
});

router.post('/drive/v3/files/:fileId/copy', (req, res, next) => {
  res.send( { id: "testid_file" } );
});

router.post('/drive/v3/files/:fileId/permissions', (req, res, next) => {
  res.send( { id: "testid_shared" } );
});

router.post('/boards', (req, res, next) => {
  res.send( { id: "testid_board" } );
});

router.post('/lists', (req, res, next) => {
  res.send( { id: "testid_list" } );
});

router.put('/boards/:boardId/members/:memberId', (req, res, next) => {
  res.send( { id: "testid_member" } );
});

router.post('/cards', (req, res, next) => {
  res.send( { id: "testid_card" } );
});

router.get('/users.admin.invite', (req, res, next) => {
      if(req.query.email === 'already.invited@7hci.com') {
        res.send( { ok: false } );
      } else {
        res.send( { ok: true } );
      }
});

module.exports.route = router;