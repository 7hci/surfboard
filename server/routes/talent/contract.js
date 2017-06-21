/**
 * @fileOverview Router that handles all requests to contract endpoint
 */
const express = require('express');
const multer = require('multer');
const contract = require('../../lib/contract');

const router = express.Router();
const storage = multer.diskStorage({
  destination: './public/upload',
  filename: (req, file, cb) => {
    cb(null, `${req.files[0].fieldname}.bmp`);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.any(), (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/preview', (req, res) => {
  contract.preview(req.body.formData, req.body.newHire)
    .then(result => res.send(result));
});

router.post('/submit', (req, res) => {
  contract.submit(req.query.id)
    .then(result => res.send(result));
});

module.exports = router;
