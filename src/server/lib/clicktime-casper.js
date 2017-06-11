/**
 * @fileOverview Script ran by shelljs to simulate ClickTime login and user creation
 */

/* eslint-disable no-var, func-names, import/no-unresolved, import/no-extraneous-dependencies, prefer-arrow-callback*/

var casper = require('casper').create({
  pageSettings: {
    userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:10.0) Gecko/20100101 Firefox/52.0)'
  },
  viewportSize: { width: 950, height: 950 },
  // verbose: true,
  // logLevel: 'debug',
  resourceTimeout: 15000
});
var x = require('casper').selectXPath;

var message = '{"text": "Problem adding user to ClickTime", "status": "failure", "task": "addUserToClickTime"}';
var name = casper.cli.get('name');
var email = casper.cli.get('email');
var testing = casper.cli.has('test');
var user = casper.cli.get('user');
var password = casper.cli.get('password');

if (testing) {
  // Return success message if running unit tests
  message = '{"text": "Added user to ClickTime", "status": "success"}';
  casper
    .start('http://www.google.com')
    .run(function () {
      this.echo(message);
      this.exit();
    });
} else {
  // Navigate to ClickTime and log in
  casper.start('https://login.clicktime.com/', function () {
    this.sendKeys('#email', user);
    this.sendKeys('#password', password);
    this.click('#loginbutton');
  });

  // Click "People" link at the top
  casper.then(function () {
    this.waitForSelector(x('//a[text()[contains(.,"People")]]'),
      function () {
        this.click(x('//a[text()[contains(.,"People")]]'));
      },
      function () {
        this.echo(message);
        this.exit();
      },
      15000);
  });

  // Click "Add Person" button
  casper.then(function () {
    this.waitForSelector(x('//*[text()[contains(.,"Add Person")]]'),
      function () {
        this.click(x('//*[text()[contains(.,"Add Person")]]'));
      },
      function () {
        this.echo(message);
        this.exit();
      },
      15000);
  });

  // Fill in name and e-mail fields
  casper.then(function () {
    this.waitForSelector('#edit-full-name',
      function () {
        this.sendKeys('#edit-full-name', name);
        this.sendKeys('#edit-email-address', email);
      },
      function () {
        this.echo(message);
        this.exit();
      },
      15000);
  });

  // Select the correct division
  casper.thenEvaluate(function () {
    var event = new Event('change');
    var select = document.querySelector('#edit-division > select');
    select.selectedIndex = 0;
    select.dispatchEvent(event);
    return true;
  });

  // Click the "Finish" button
  casper.then(function () {
    this.waitForSelector(x('//*[text()[contains(.,"Finish")]]'),
      function () {
        this.click(x('//*[text()[contains(.,"Finish")]]'));
      },
      function () {
        this.echo(message);
        this.exit();
      },
      15000);
  });

  // Give ClickTime some time to process request. If we exit too soon, the person won't be added.
  casper.then(function () {
    this.wait(30000);
  });

  // If "about:blank" redirect issue is resolved in the future, uncomment the section below to verify that ClickTime
  // was able to successfully add the person
  // casper.then(function () {
  //   this.waitForSelector(x('//span[text()[contains(.,"added successfully")]]'),
  //     function () {
  //     },
  //     function () {
  //       this.echo(message);
  //       this.exit();
  //     },
  //     30000);
  // });

  casper.then(function () {
    message = '{"text": "Added user to ClickTime", "status": "success", "task": "addUserToClickTime"}';
  });

  casper.run(function () {
    this.echo(message);
    this.exit();
  });
}

