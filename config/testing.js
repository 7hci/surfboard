module.exports = {
  "google": {
    "clientId": "",
    "clientSecret": "",
    "redirectUri": "http://localhost:5000/oauth2callback",
    "scope": "https://www.googleapis.com/auth/drive https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user",
    "baseUrl": "http://localhost:5000/mock-api"
  },
  "trello": {
    "key": "",
    "token": "",
    "team": {
      "id": "",
      "members":[
        {
          "name": "Daniel",
          "id": ""
        },
        {
          "name": "Scott",
          "id": ""
        },
        {
          "name": "Red",
          "id": ""
        }
      ]
    }
  },
  "slack": {
    "token": ""
  },
  "drive": {
    "folders" : {
      "contractors": "",
      "forms": ""
    },
    "files" : {
      "tasks": "",
      "w9": "",
      "w8": "",
      "mssa": "",
      "directDeposit": "",
      "bgCheck": ""
    }
  },
  "tasks": {
    "formOptions": [
      {
        "name": "createContractorEmail",
        "text": "Add contractor to 7hci domain"
      },
      {
        "name": "sendLoginEmail",
        "text": "E-mail credentials to contractor"
      },
      {
        "name": "addAndShareDriveFolder",
        "text": "Create HR folder for contractor"
      },
      {
        "name": "sendDriveEmail",
        "text": "Send document instructions to contractor"
      },
      {
        "name": "createTrelloBoard",
        "text": "Create Trello board for onboarding tasks"
      },
      {
        "name": "inviteToSlack",
        "text": "Invite contractor to Slack"
      }
    ]
  }
};

