/* eslint-disable no-undef, no-alert*/
import $ from 'jquery';
import io from 'socket.io-client';
import PDFObject from 'pdfobject';

let socket;
let newHires;
let currentNewHire;

if ($('body').is('#dashboard')) {
  socket = io()
    .on('connect', () => {
      if (!newHires) socket.emit('get_hires');
    })
    .on('new_hires', (people) => {
      newHires = people;
      people.forEach((person) => {
        const progress = (person.step / 7) * 100;
        const content = `<li id="${person.id}" class="list-group-item new-hire hide">${
            person.firstName} ${person.lastName
            }<br><div class="progress w-100">` +
          `<div class="progress-bar bg-success" role="progressbar" style="width: ${progress}%">` +
          '</div></div></li>';
        $(content).appendTo($('#inProgress')).slideDown('slow');
      });
    })
    .on('step_done', (s, person) => {
      $('div[id^=step]').fadeOut();
      $(`#step${s + 1}`).fadeIn();
      $('#spinner').fadeOut();
      if (person) currentNewHire = person;
    })
    .on('update', (msg) => {
      const status = msg.status;
      const text = msg.text;
      let icon;
      if (status === 'success') {
        icon = '&nbsp;<i class="fa fa-check-circle"></i>';
      } else {
        icon = '&nbsp;<i class="fa fa-exclamation-circle"></i>';
      }
      const content = `<p class="${status}">${text}${icon}</p>`;
      $('#updates').append($(content));
    })
    .on('finish', () => {
      $('#spinner').fadeOut();
      $('#continueStep5').fadeIn();
    })
    .on('completed_onboarding', () => {
      newHires = null;
      socket.emit('get_hires');
      $('#inProgress').empty();
      $('#step6').fadeOut();
      $('#step0').fadeIn();
    })
    .on('server_error', () => {
      $('#spinner').fadeOut();
      alert('Server error');
    });
}

$('#infoForm').on('submit', function infoFormSubmit(event) {
  event.preventDefault();
  socket.emit('add_hire', $(this).serializeArray(), credentials);
});

$('#contractForm').on('submit', function contractFormSubmit(event) {
  event.preventDefault();
  socket.emit('send_mssa', $(this).serializeArray(), currentNewHire, credentials);
});

$('#onboardForm').on('submit', function onboardFormSubmit(event) {
  event.preventDefault();
  socket.emit('onboard', $(this).serializeArray(), currentNewHire, credentials);
  $('#step5').fadeOut();
  $('#spinner').fadeIn();
  $('#step5Progress').fadeIn();
});

$('[data-skip-to]').click(function skipClick() {
  const step = $(this).data('skip-to');
  socket.emit('skip_to', currentNewHire, step);
});

$('[data-continue-to]').click(function continueClick() {
  const s = $(this).data('continue-to');
  $('div[id^=step]').fadeOut();
  $(`#step${s}`).fadeIn();
});

$('#step4SubmitButton').click(() => {
  $('#pdfPreview').empty();
  socket.emit('sign_mssa', currentNewHire);
});

$('#step6CompleteButton').click(() => {
  socket.emit('complete_onboarding', currentNewHire);
});

$('#inProgress').on('click', 'li', function inProgressClick() {
  const id = this.id;
  currentNewHire = newHires.find(hire => (hire.id === id));
  if (currentNewHire.step === 4) {
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${currentNewHire.contractId}/export?`
      + `mimeType=application%2Fpdf&access_token=${credentials.access_token}`;
    PDFObject.embed(exportUrl, '#pdfPreview', { height: '100%' });
  }
  $('#step0').fadeOut();
  $(`#step${currentNewHire.step}`).fadeIn();
});

$('input[name=createContractorEmail]').change(function taskCheckValidate() {
  if ($(this).is(':checked')) {
    $('input[name=sendLoginEmail]').prop('disabled', false);
  } else {
    $('input[name=sendLoginEmail]')
      .prop('disabled', true)
      .prop('checked', false);
  }
});
