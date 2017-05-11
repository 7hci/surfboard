/* eslint-disable */
var rawSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
var formattedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[2];

var dateStart = new Date(Date.now() - 7 * 24 * 60 * 60  * 1000);
var dateEnd = new Date(Date.now() - 24 * 60 * 60 * 1000);

// projectRows keeps track of which rows belong to which project
var projectRows = {};

var config = getConfig();

getUpdatedData();

// Generate a report for every report listed in the config
for (var r in config.timesheetReport.queue) {
  var report = config.timesheetReport.queue[r];
  generateReport(report);
}

function getConfig() {
  var apiKey = '4aee61a16a20a131033d5a2e86d1ba8b';
  var url = 'http://surfboard.reardenapps.com/api/settings';
  var options = {
    'headers': {
      'X-Api-Key': apiKey
    }
  };
  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response);
}

function getUpdatedData() {
  if (config.timesheetReport.enabled == "false") return;

  // Format start and end dates into format accepted by API endpoint
  var startString = dateStart.getFullYear() + '' + pad(dateStart.getMonth() + 1, 2) + '' + pad(dateStart.getDate(), 2);
  var endString = dateEnd.getFullYear() + '' + pad(dateEnd.getMonth() + 1, 2) + '' + pad(dateEnd.getDate(), 2);

  var url = 'https://app.clicktime.com/App/CustomExport/RunSavedExport.aspx'
    + '?ID=' + config.clicktime.reportId
    + '&Email=' + encodeURIComponent(config.clicktime.username)
    + '&UserKey=' + config.clicktime.key
    + '&UID=' + config.clicktime.uid
    + '&StartDate=' + startString
    + '&EndDate=' + endString
    + '&Format=csv';

  // Delete old data
  rawSheet.clear();
  formattedSheet.clear();

  // Setting A1 to IMPORTDATA(url) populates the sheet with data from the API
  rawSheet.getRange('A1').setValue('=IMPORTDATA("'+ url +'")');

  // Copy the values of the imported data to another sheet. Can't work with existing sheet
  // Because any changes to the IMPORTDATA cell will cause the rest of the cells to disappear
  var numEntries = rawSheet.getLastRow() - 1;
  var rawRange = rawSheet.getRange(2, 1, numEntries, 4);
  rawRange.copyValuesToRange(formattedSheet, 1, 4, 1, numEntries);

  // Sort our copied data by primarily the person, then the project then the date
  var copyRange = formattedSheet.getDataRange();
  copyRange.sort([2,3,1]);

  // We need to do some work on each row before generating any reports...
  for (var r = 1; r <= formattedSheet.getLastRow();) {
    var project = formattedSheet.getRange(r, 3).getValue();

    // Swap name and date columns, reformatting the date
    var name = formattedSheet.getRange(r, 2).getValue();
    var dateNum = formattedSheet.getRange(r, 1).getValue();
    formattedSheet.getRange(r, 1).setValue(name);
    formattedSheet.getRange(r, 2).setValue((convertDate(dateNum).toDateString()).substr(4));

    if (project in projectRows) {
      projectRows[project].rows.push(r);
    } else {
      projectRows[project] = {};
      projectRows[project].rows = [r];
    }
    r++
  }
}

// Pad number with extra zeroes
function pad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

// Convert excel date number to js Date object
function convertDate(excelDate) {
  return new Date((excelDate - 25568)*86400*1000);
}

function generateReport(report) {
  // Generate date strings for the start and end of the week that will be shown in the report
  var weekStarting = (dateStart.getMonth() + 1) + '/' + dateStart.getDate() + '/' + String(dateStart.getFullYear()).substr(2)
  var weekEnding = (dateEnd.getMonth() + 1 ) + '/' + dateEnd.getDate() + '/' + String(dateEnd.getFullYear()).substr(2);

  // Set report header cells
  reportSheet.getRange(1,1).setValue('Hour Detail by Contractor (' + report.description + ')');
  reportSheet.getRange(2,1).setValue(weekStarting + ' - ' + weekEnding);

  // Delete previous report's data
  if (reportSheet.getMaxRows() > 4) {
    reportSheet.deleteRows(5, reportSheet.getMaxRows() - 4);
  }

  // Figure out which rows to include in the report based on projectsToInclude in config
  var rows = [];
  report.projectsToInclude.forEach(function(project) {
    try {
      rows = rows.concat(projectRows[project].rows);
    } catch (err) {
      Logger.log(err);
    }
  });

  // Sort the rows to get them back in order and then append them to the report
  rows.sort(function (a, b) { return a - b; });
  rows.forEach(function (row) {
    reportSheet.appendRow(formattedSheet.getRange(row, 1, 1, 4).getValues()[0]);
  });

  // Arrays to keep track of which cells we need to sum when we get to the end of a block of project/contractor hours or the end of all the hours
  var currentPerson = [];
  var currentProject = [];
  var allTotals = [];

  for (var r = 5; r <= reportSheet.getLastRow();r++) {
    var project = reportSheet.getRange(r, 3).getValue();
    var projectBelow = reportSheet.getRange(r+1, 3).getValue();
    var projectAbove = reportSheet.getRange(r-1, 3).getValue();
    var name = reportSheet.getRange(r, 1).getValue();
    var nameBelow = reportSheet.getRange(r+1, 1).getValue();
    var nameAbove = reportSheet.getRange(r-1, 1).getValue();
    var date = reportSheet.getRange(r, 2).getDisplayValue();
    var dateBelow = reportSheet.getRange(r+1, 2).getDisplayValue();

    // There's multiple entries for the same day, so let's merge them
    while (nameBelow == name && projectBelow == project && dateBelow == date) {
      var todayHours = reportSheet.getRange(r,4).getValue();
      var tomorrowHours = reportSheet.getRange(r+1,4).getValue();
      reportSheet.getRange(r,4).setValue(todayHours + tomorrowHours);
      reportSheet.deleteRow(r+1);
      nameBelow = reportSheet.getRange(r+1, 1).getValue();
      projectBelow = reportSheet.getRange(r+1, 3).getValue();
      dateBelow = reportSheet.getRange(r+1, 2).getDisplayValue();
    }

    // Hide contractor name or project name if it's already printed in an earlier row
    // Have to set the color back to black because an appended row inherit style from above row
    if (projectAbove == project) {
      reportSheet.getRange(r,3).setFontColor('#ffffff');
    } else {
      reportSheet.getRange(r,3).setFontColor('#000000')
    }
    if (nameAbove == name) {
      reportSheet.getRange(r,1).setFontColor('#ffffff');
    } else {
      reportSheet.getRange(r,1).setFontColor('#000000')
    }

    // currentProject keeps track of all hours for the project we're currently "in"
    currentProject.push('D'+r);

    if (nameBelow != name) {
      // We're done with this contractor, sum up the hours for the current project, then sum up the hours for the contractor
      reportSheet.insertRowAfter(r);
      reportSheet.getRange(r+1, 1, 1, 4).setValues([['', '', project + ' Total:', '=SUM(' + currentProject + ')']])
        .setFontWeight('bold')
        .setFontColor('#000000')
        .setHorizontalAlignment('right');
      currentProject = [];
      currentPerson.push('D'+(r+1));
      reportSheet.insertRowAfter(r+1);
      reportSheet.getRange(r+2, 1, 1, 4).setValues([['', '', name + ' Total:', '=SUM(' + currentPerson + ')']])
        .setFontWeight('bold')
        .setFontColor('#000000')
        .setHorizontalAlignment('right');
      reportSheet.insertRowAfter(r+2);
      if (config.timesheetReport.notifyPersonnel == "true")
        notifyContractor(name, report.description, reportSheet.getRange(r+2, 4).getDisplayValue(), weekEnding);
      currentPerson = [];
      allTotals.push('D'+(r+2));
      reportSheet.getRange(r+3, 1, 1, 4).setValue(' ');
      r = r + 3;
    } else if (nameBelow == name && projectBelow != project) {
      // We're done with this project so sum up the hours it
      reportSheet.insertRowAfter(r);
      reportSheet.getRange(r+1, 1, 1, 4).setValues([['', '', project + ' Total:', '=SUM(' + currentProject + ')']])
        .setFontWeight('bold')
        .setFontColor('#000000')
        .setHorizontalAlignment('right');
      currentProject = [];
      currentPerson.push('D'+(r+1));
      r++;
    } else if (nameBelow == name && projectBelow == project && dateBelow == date) {

    }

  }
  // Sum up all the project totals to get Grand Total
  reportSheet.appendRow(['', '', 'Grand Total:', '=SUM(' + allTotals + ')']);

  // Additional style formatting
  reportSheet.getRange(reportSheet.getMaxRows(), 3).setHorizontalAlignment('right');
  reportSheet.getRange(5, 4, reportSheet.getMaxRows() - 4, 1).setNumberFormat('0.00').setHorizontalAlignment('right');
  reportSheet.getRange('A4').copyFormatToRange(reportSheet, 1, 4, reportSheet.getMaxRows() - 1, reportSheet.getMaxRows() - 1);

  // Create a dummy sheet for exporting
  var newSpreadsheet = SpreadsheetApp.create("Spreadsheet to export");
  reportSheet.copyTo(newSpreadsheet);
  newSpreadsheet.getSheetByName('Sheet1').activate();
  newSpreadsheet.deleteActiveSheet();

  // Generate the PDF
  var pdf = DriveApp.getFileById(newSpreadsheet.getId()).getAs('application/pdf').getBytes();
  var attach = {fileName:'Hour Detail By Contractor ('+ report.description +').pdf',content:pdf, mimeType:'application/pdf'};

  // Send the e-mail
  MailApp.sendEmail({
    name: config.timesheetReport.message.sender,
    to: report.recipients.join(),
    cc: report.cc.join(),
    subject: '7HCI Hours for W/E ' + weekEnding + ' (' + report.description + ')',
    htmlBody: config.timesheetReport.message.body.report + config.timesheetReport.message.signature,
    attachments:[attach]
  });

  // Delete the dummy sheet now that we're done
  DriveApp.getFileById(newSpreadsheet.getId()).setTrashed(true);
}

function notifyContractor(name, project, totalHours, weekEnding) {
  var contractor = false;
  for (var i = 0; i < config.personnel.length; i++) {
    var person = config.personnel[i];
    if (person.name == name) {
      contractor = person;
      break;
    }
  }
  if (contractor)  {
    var receiver = contractor.email;
    var body = config.timesheetReport.message.body.notify + '<br><br>' + project + ' - ' + totalHours + config.timesheetReport.message.signature;

    MailApp.sendEmail({
      name: config.sender,
      to: receiver,
      subject: 'Hours Submitted for W/E ' + weekEnding,
      htmlBody: body
    });
  }
}