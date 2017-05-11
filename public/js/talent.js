/* eslint-disable*/
var newHire;
var uploaded = false;
var uploading = false;

var socket = io()
  .on('connect', function () {
    if (!newHire) {
      var pathParts = location.pathname.split('/');
      var id = pathParts[pathParts.length - 1];
      socket.emit('get_hire', id);
    }
  })
  .on('new_hire', function (person) {
    newHire = person;
    if (newHire.step > 3) {
      $('#step4').fadeIn()
    } else {
      $('#step' + newHire.step).fadeIn();
    }
  })
  .on('mssa_submitted', function () {
    $('#step3Preview').fadeOut();
    $('#step4').fadeIn();
  })
  .on('mssa_preview', function (fileId, token) {
    var exportUrl = 'https://www.googleapis.com/drive/v3/files/' + fileId + '/export?'
      + 'mimeType=application%2Fpdf&access_token=' + token;
    PDFObject.embed(exportUrl, '#pdfPreview', {height: '100%'});
    $('#step3').fadeOut();
    $('#step3Preview').fadeIn();
    $('#spinner').fadeOut();
  })
  .on('server_error', function () {
    $('#spinner').fadeOut();
    alert('Server error');
  });

var uploader = new SocketIOFileClient(socket)
  .on('start', function () {
  uploaded = false;
  uploading = true;
  $('#spinner').fadeIn();
})
  .on('complete', function (fileInfo) {
  uploaded = true;
  uploading = false;
  $('#spinner').fadeOut();
  $('#signatureFile').val(fileInfo.name);
})
  .on('error', function () {
  uploaded = false;
  uploading = false;
  $('#spinner').fadeOut();
  alert('Error encountered while uploading file!');
});

$('#signature').change(function () {
  uploader.upload(this.files);
});

$('#previewButton').click(function () {
  if (uploading) {
    alert('Please wait while upload finishes.');
    return;
  }
  $('#previewButton').prop('disabled', true);
  $('#spinner').fadeIn();
  socket.emit('mssa_previewed', $('#contractForm').serializeArray(), newHire.id, newHire.credentials);
});

$('#submitButton').click(function () {
  if (!uploaded) {
    alert('Please go back and upload a signature first');
    return;
  }
  if ($('form#contractForm :input[required]').filter(function () {
      return !(this.value)
    }).length) {
    alert('Please go back and fill in all required fields');
    return;
  }
  socket.emit('mssa_submitted', $('#contractForm').serializeArray(), newHire.id);
  $('#submitButton').prop('disabled', true);
});

$('#previewBackButton').click(function () {
  $('#previewButton').prop('disabled', false);
  $('#step3Preview').fadeOut();
  $('#step3').fadeIn();
});
