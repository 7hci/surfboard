const path = require('path');
const fs = require('fs');
const { NewHire } = require('../../db');
const { authenticate } = require('./helpers');

module.exports = {
  // admin endpoints
  newHire: (obj, { formData }, { credentials }) =>
    authenticate(credentials).then(() => NewHire.add(formData, credentials)),
  skipStep: (obj, { id, step }, { credentials }) =>
    authenticate(credentials).then(() => NewHire.skipStep(id, step)),
  sendContract: (obj, { formData, id }, { credentials }) =>
    authenticate(credentials).then(() => NewHire.sendContract(formData, id, credentials)),
  acceptContract: (obj, { id }, { credentials }) =>
    authenticate(credentials).then(() => NewHire.acceptContract(id, credentials)),
  completeHire: (obj, { id }, { credentials }) =>
    authenticate(credentials).then(() => NewHire.complete(id)),
  // client endpoints
  previewContract: (obj, { formData, id }) =>
    NewHire.previewContract(formData, id),
  submitContract: (obj, { id }) =>
    NewHire.submitContract(id),
  uploadSignature: (obj, { id, file }) => {
    fs.rename(file.path, `${path.dirname(file.path)}/${id}.bmp`);
    return true;
  }
};
