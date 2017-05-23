const models = require('../models');

const settingArray = [
  {
    key: 'clicktime',
    value: {
      key: 'k2U1h0em5ydGZSWld5NnIzdDZlRWFZcUxJWGFoZGtNeUw%3d',
      uid: 'k2ODhiSUI1eCtsUUpiZUQyYk1tNlhPZz09',
      reportId: '2Vj6QYf3Z1bY',
      username: 'daniel@7hci.com'
    }
  },
  {
    key: 'timesheetReporter',
    value: {
      queue: [
        {
          cc: ['scott@7hci.com'],
          recipients: ['amarotto@brightcove.com', 'skittredge@brightcove.com'],
          description: 'HBO Asia',
          projectsToInclude: ['HBO Asia']
        },
        {
          cc: ['scott@7hci.com'],
          recipients: ['mgolden@brightcove.com', 'skittredge@brightcove.com'],
          description: 'Lightbox',
          projectsToInclude: ['Lightbox', 'Lightbox - Middleware Lead']
        }
      ],
      enabled: 'true',
      notifyPersonnel: 'true',
      message: {
        body: {
          notify: 'These are the hours that were submitted for last week. If there is a discrepancy between the hours you entered and the total shown below, please let me know. If you did not enter all your hours on time, you will need to follow up with the client directly.',
          report: "See the attached report for last week's hours. If you have any questions, please let me know."
        },
        sender: 'Daniel Rearden',
        signature: "<br><br>Thank you,<br>Daniel Rearden<br>Office Administrator<br>7HCI<br>e: <a href='mailto:daniel@7hci.com'>daniel@7hci.com</a><br>m: <a href='tel:(919)%20998-9032'>919-998-9032<a/><br>"
      }
    }
  }
];

models.sequelize.sync().then(() => models.Setting.bulkCreate(settingArray));
