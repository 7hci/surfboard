/* eslint-disable no-undef, no-alert*/
import $ from 'jquery';
import io from 'socket.io-client';
import SocketIOFileClient from 'socket.io-file-client';
import PDFObject from 'pdfobject';

let newHire;
let socket;
let uploader;
let uploaded = false;
let uploading = false;

if ($('body').is('#talent')) {
  socket = io()
    .on('connect', () => {
      if (!newHire) {
        const pathParts = location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        socket.emit('get_hire', id);
      }
    })
    .on('new_hire', (person) => {
      newHire = person;
      if (newHire.step > 3) {
        $('#step4').fadeIn();
      } else {
        $(`#step${newHire.step}`).fadeIn();
      }
    })
    .on('mssa_submitted', () => {
      $('#step3Preview').fadeOut();
      $('#step4').fadeIn();
    })
    .on('mssa_preview', (fileId, token) => {
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?`
        + `mimeType=application%2Fpdf&access_token=${token}`;
      PDFObject.embed(exportUrl, '#pdfPreview', { height: '100%' });
      $('#step3').fadeOut();
      $('#step3Preview').fadeIn();
      $('#spinner').fadeOut();
    })
    .on('server_error', () => {
      $('#spinner').fadeOut();
      alert('Server error');
    });

  uploader = new SocketIOFileClient(socket)
    .on('start', () => {
      uploaded = false;
      uploading = true;
      $('#spinner').fadeIn();
    })
    .on('complete', (fileInfo) => {
      uploaded = true;
      uploading = false;
      $('#spinner').fadeOut();
      $('#signatureFile').val(fileInfo.name);
    })
    .on('error', () => {
      uploaded = false;
      uploading = false;
      $('#spinner').fadeOut();
      alert('Error encountered while uploading file!');
    });
}

$('#signature').change(function signatureUpload() {
  uploader.upload(this.files);
});

$('#previewButton').click(() => {
  if (uploading) {
    alert('Please wait while upload finishes.');
    return;
  }
  $('#previewButton').prop('disabled', true);
  $('#spinner').fadeIn();
  socket.emit('mssa_previewed', $('#contractForm').serializeArray(), newHire.id, newHire.credentials);
});

$('#submitButton').click(() => {
  if (!uploaded) {
    alert('Please go back and upload a signature first');
    return;
  }
  if ($('form#contractForm :input[required]').filter(function checkRequired() {
    return !(this.value);
  }).length) {
    alert('Please go back and fill in all required fields');
    return;
  }
  socket.emit('mssa_submitted', $('#contractForm').serializeArray(), newHire.id);
  $('#submitButton').prop('disabled', true);
});

$('#previewBackButton').click(() => {
  $('#previewButton').prop('disabled', false);
  $('#step3Preview').fadeOut();
  $('#step3').fadeIn();
});
