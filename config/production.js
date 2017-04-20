module.exports = {
  "google": {
    "clientId": "",
    "clientSecret": "",
    "redirectUri": "http://localhost:5000/oauth2callback",
    "scope": "https://www.googleapis.com/auth/drive https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user",
    "baseUrl": "https://www.googleapis.com"
  },
  "clicktime": {
    "user": "",
    "password": "",
    "test": ""
  },
  "trello": {
    "key": "",
    "token": "",
    "baseUrl": "https://api.trello.com/1",
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
    "token": "",
    "baseUrl": "https://slack.com/api"
  },
  "drive": {
    "folders" : {
      "contractors": "",
      "forms": ""
    },
    "files" : {
      "task": {
        "name": "Tasks",
        "id": ""
      },
      "w9": {
        "name": "Form W-9",
        "id": ""
      },
      "w8": {
        "name": "Form W-8BEN",
        "id": ""
      },
      "mssa": {
        "name": "MSSA",
        "id": ""
      },
      "directDeposit": {
        "name": "Direct Deposit Form",
        "id": ""
      },
      "bgCheck": {
        "name": "Background Check Authorization",
        "id": ""
      }
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

