/**
 * @fileOverview Router for all mock api calls made during testing
 *
 */
const express = require('express');

const router = express.Router();

router.post('/admin/directory/v1/users', (req, res) => {
  res.send({ id: 'testid' });
});

router.get('/admin/directory/v1/users', (req, res) => {
  res.send({
    users: [
      {
        id: 'testid',
        lastLoginTime: '2017-01-01T00:00:00.000Z'
      }
    ]
  });
});

router.post('/gmail/v1/users/me/messages/send', (req, res) => {
  res.send({ id: 'testid' });
});

router.post('/drive/v3/files', (req, res) => {
  res.send({ id: 'testid_folder' });
});

router.post('/drive/v3/files/:fileId/copy', (req, res) => {
  res.send({ id: 'testid_file' });
});

router.post('/drive/v3/files/:fileId/permissions', (req, res) => {
  res.send({ id: 'testid_shared' });
});

router.get('/drive/v3/files/:fileId/export', (req, res) => {
  res.send('sample,tasks,list\nsample,tasks,list');
});

router.post('/boards', (req, res) => {
  res.send({ id: 'testid_board' });
});

router.post('/lists', (req, res) => {
  res.send({ id: 'testid_list' });
});

router.put('/boards/:boardId/members/:memberId', (req, res) => {
  res.send({ id: 'testid_member' });
});

router.post('/cards', (req, res) => {
  res.send({ id: 'testid_card' });
});

router.get('/users.admin.invite', (req, res) => {
  if (req.query.email === 'already.invited@7hci.com') {
    res.send({ ok: false });
  } else {
    res.send({ ok: true });
  }
});

module.exports.route = router;
