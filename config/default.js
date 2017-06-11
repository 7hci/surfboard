module.exports = {
  api: {
    key: '4aee61a16a20a131033d5a2e86d1ba8b'
  },
  db: {
    username: 'surfboard',
    database: 'surfboard',
    host: 'db',
    dialect: 'postgres'
  },
  google: {
    clientId: '',
    clientSecret: '',
    scope: 'https://www.googleapis.com/auth/drive https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/script.send_mail https://www.googleapis.com/auth/script.external_request',
    baseUrl: 'https://www.googleapis.com',
    redirectUri: 'http://surfboard.7hci.com/oauth2callback'
  },
  clicktime: {
    user: '',
    password: ''
  },
  trello: {
    key: '',
    token: '',
    baseUrl: 'https://api.trello.com/1',
    team: {
      id: '',
      members: [
        {
          name: 'Daniel',
          id: ''
        },
        {
          name: 'Scott',
          id: ''
        },
        {
          name: 'Red',
          id: ''
        }
      ]
    }
  },
  slack: {
    token: '',
    baseUrl: 'https://slack.com/api'
  },
  drive: {
    folders: {
      contractors: '',
      forms: ''
    },
    files: {
      task: {
        name: 'Tasks',
        id: 'test'
      },
      w9: {
        name: 'Form W-9',
        id: ''
      },
      w8: {
        name: 'Form W-8BEN',
        id: ''
      },
      mssa: {
        name: 'MSSA',
        id: ''
      },
      directDeposit: {
        name: 'Direct Deposit Form',
        id: ''
      },
      bgCheck: {
        name: 'Background Check Authorization',
        id: ''
      }
    }
  },
  tasks: {
    formOptions: [
      {
        name: 'createContractorEmail',
        text: 'Add contractor to 7hci domain'
      },
      {
        name: 'sendLoginEmail',
        text: 'E-mail credentials to contractor'
      },
      {
        name: 'addAndShareDriveFolder',
        text: 'Add onboarding documents to contractor folder'
      },
      {
        name: 'sendWelcomeEmail',
        text: 'Send welcome e-mail to contractor'
      },
      {
        name: 'createTrelloBoard',
        text: 'Create Trello board for onboarding tasks'
      },
      {
        name: 'inviteToSlack',
        text: 'Invite contractor to Slack'
      },
      {
        name: 'addUserToClickTime',
        text: 'Add user to ClickTime'
      }
    ]
  },
  defaults: {
    mssa: 'Please click the link below to complete and sign the Master Subcontractor Service Agreement. If you have any questions or concerns, please let me know.'
  }
};
