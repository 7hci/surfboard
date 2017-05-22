/* eslint-disable*/
var newHires;
var currentNewHire;

var socket = io()
  .on('connect', function () {
    if (!newHires) socket.emit('get_hires');
  })
  .on('new_hires', function (people) {
    newHires = people;
    people.forEach(function (person) {
      var progress = person.step / 6 * 100;
      var content = '<li id="' + person.id + '" class="list-group-item new-hire">' +
        person.firstName + ' ' + person.lastName +
        '<br><div class="progress w-100">' +
        '<div class="progress-bar bg-success" role="progressbar" style="width: ' + progress + '%">' +
        '</div></div></li>';
      $('#inProgress').append($(content));
    });
  })
  .on('step_done', function (s, person) {
    $('div[id^=step]').fadeOut();
    $('#step' + (s + 1)).fadeIn();
    $('#spinner').fadeOut();
    if (person) currentNewHire = person;
  })
  .on('update', function (msg) {
    var status = msg.status;
    var text = msg.text;
    var icon;
    if (status === 'success') {
      icon = '&nbsp;<i class="fa fa-check-circle"></i>';
    } else {
      icon = '&nbsp;<i class="fa fa-exclamation-circle"></i>'
    }
    var content = '<p class="' + status + '">' + text + icon + '</p>';
    $('#updates').append($(content));
  })
  .on('finish', function () {
    $('#spinner').fadeOut();
    $('#continueStep5').fadeIn();
  })
  .on('completed_onboarding', function() {
    newHires = null;
    socket.emit('get_hires');
    $('#inProgress').empty();
    $('#step6').fadeOut();
    $('#step0').fadeIn();
  })
  .on('server_error', function () {
    $('#spinner').fadeOut();
    alert('Server error');
  });

$('#infoForm').on('submit', function (event) {
  event.preventDefault();
  socket.emit('add_hire', $(this).serializeArray(), credentials);
});

$('#contractForm').on('submit', function (event) {
  event.preventDefault();
  socket.emit('send_mssa', $(this).serializeArray(), currentNewHire, credentials);
});

$('#onboardForm').on('submit', function (event) {
  event.preventDefault();
  socket.emit('onboard', $(this).serializeArray(), currentNewHire, credentials);
  $('#step5').fadeOut();
  $('#spinner').fadeIn();
  $('#step5Progress').fadeIn();
});

$('[data-skip-to]').click(function () {
  var step = $(this).data('skip-to');
  socket.emit('skip_to', currentNewHire, step);
});

$('[data-continue-to]').click(function () {
  var s = $(this).data('continue-to');
  $('div[id^=step]').fadeOut();
  $('#step' + s).fadeIn();
});

$('#step4SubmitButton').click(function () {
  $('#pdfPreview').empty();
  socket.emit('sign_mssa', currentNewHire);
});

$('#step6CompleteButton').click(function () {
  socket.emit('complete_onboarding', currentNewHire);
});

$('#inProgress').on('click', 'li', function () {
  var id = this.id;
  currentNewHire = newHires.find(function (hire) {
    return (hire.id === id)
  });
  if (currentNewHire.step === 4) {
    var exportUrl = 'https://www.googleapis.com/drive/v3/files/' + currentNewHire.contractId + '/export?'
      + 'mimeType=application%2Fpdf&access_token=' + credentials.access_token;
    PDFObject.embed(exportUrl, '#pdfPreview', {height: '100%'});
  }
  $('#step0').fadeOut();
  $('#step' + currentNewHire.step).fadeIn();
});

$('input[name=createContractorEmail]').change(function () {
  if ($(this).is(":checked")) {
    $('input[name=sendLoginEmail]').prop('disabled', false);
  } else {
    $('input[name=sendLoginEmail]')
      .prop('disabled', true)
      .prop('checked', false);
  }
});
