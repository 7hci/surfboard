/* eslint-disable no-var, func-names, import/no-unresolved, import/no-extraneous-dependencies*/

var casper = require('casper').create({
  pageSettings: {
    userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:10.0) Gecko/20100101 Firefox/52.0)'
  },
  viewportSize: { width: 950, height: 950 },
  // verbose: true,
  // logLevel: 'debug',
  resourceTimeout: 15000
});

var message = '{"text": "Problem adding user to ClickTime", "status": "failure"}';
var name = casper.cli.get('name');
var email = casper.cli.get('email');
var testing = casper.cli.has('test');
var user = casper.cli.get('user');
var password = casper.cli.get('password');

if (testing) {
  message = '{"text": "Added user to ClickTime", "status": "success"}';
  casper.start('http://www.js.google.com');
} else {
  casper.start('https://login.clicktime.com/', function () {
    this.sendKeys('#email', user);
    this.sendKeys('#password', password);
    this.click('#loginbutton');
  });

  casper.waitForSelector('#ctl00_PageHeaderContentPlaceHolder_HeaderControl_lnkPeople', function () {
    this.click('#ctl00_PageHeaderContentPlaceHolder_HeaderControl_lnkPeople');
  });

  casper.waitForSelector('#ext-gen114', function () {
    this.click('#ext-gen114');
  });

  casper.waitForSelector('#edit-full-name', function () {
    this.sendKeys('#edit-full-name', name);
    this.sendKeys('#edit-email-address', email);
    this.click('#MainContentsTR > div > header > div:nth-child(5) > button:nth-child(2)');
  });

  casper.waitForSelector('#unhandledErrorModal > div > div > div.modal-footer > a:nth-child(2)', function () {
    this.click('#MainContentsTR > div > header > div:nth-child(5) > button:nth-child(3)');
    this.wait(10000);
    message = '{"text": "Added user to ClickTime", "status": "success"}';
  });
}
casper.run(function () {
  this.echo(message);
  this.exit();
});
