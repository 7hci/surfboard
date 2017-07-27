module.exports = {
  db: {
    uri: 'postgres://postgres@localhost:5432/surfboard' || process.env.DATABASE_URL
  },
  google: {
    scope: 'https://www.googleapis.com/auth/drive https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/script.send_mail https://www.googleapis.com/auth/script.external_request',
    baseUrl: 'https://www.googleapis.com'
  },
  clicktime: {
  },
  trello: {
    baseUrl: 'https://api.trello.com/1',
    team: {
      members: []
    }
  },
  slack: {
    baseUrl: 'https://slack.com/api'
  },
  drive: {
    folders: {
    },
    files: {
      task: {
        name: 'Tasks'
      },
      w9: {
        name: 'Form W-9'
      },
      w8: {
        name: 'Form W-8BEN'
      },
      mssa: {
        name: 'MSSA'
      },
      directDeposit: {
        name: 'Direct Deposit Form'
      },
      bgCheck: {
        name: 'Background Check Authorization'
      }
    }
  }
};
