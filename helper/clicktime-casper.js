var casper = require('casper').create({
  pageSettings: {
    userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:10.0) Gecko/20100101 Firefox/52.0)'
  },
});
var message = "{'text': 'Problem adding user to ClickTime', 'status': 'failure'}";
var name = casper.cli.get('name');
var email = casper.cli.get('email');
var testing = casper.cli.has('test');
var user = casper.cli.get('user');
var password = casper.cli.get('password');

if (testing) {

  message = "{'text': 'Added user to ClickTime', 'status': 'success'}";
  casper.start('http://www.google.com');

} else {

  casper.start('https://login.clicktime.com/', function () {
    this.sendKeys('#email', user);
    this.sendKeys('#password', password);
    this.click('#loginbutton');
  });

  casper.then(function () {
    this.waitForSelector('#ctl00_PageHeaderContentPlaceHolder_HeaderControl_lnkPeople', function () {
      this.click('#ctl00_PageHeaderContentPlaceHolder_HeaderControl_lnkPeople');
    });
  });

  casper.then(function () {
    this.waitForSelector('#ext-gen114', function () {
      this.click('#ext-gen114');
    });
  });

  casper.then(function () {
    this.waitForSelector('#edit-full-name', function () {
      this.sendKeys('#edit-full-name', name);
      this.sendKeys('#edit-email-address', email);
      this.click('#MainContentsTR > div > header > div:nth-child(5) > button:nth-child(2)');
    });
  });

  casper.then(function () {
    this.waitForSelector('#unhandledErrorModal > div > div > div.modal-footer > a:nth-child(2)', function () {
      this.click('#MainContentsTR > div > header > div:nth-child(5) > button:nth-child(3)');
      this.wait(10000);
      message = "{'text': 'Added user to ClickTime', 'status': 'success'}";
    });
  });

}

casper.run(function () {
  this.echo(message);
  this.exit();
});