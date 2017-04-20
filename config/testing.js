module.exports = {
  "google": {
    "clientId": "",
    "clientSecret": "",
    "redirectUri": "http://localhost:5000/oauth2callback",
    "scope": "https://www.googleapis.com/auth/drive https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user",
    "baseUrl": "http://127.0.0.1:5000/mock-api"
  },
  "clicktime": {
    "user": "",
    "password": "",
    "test": " --test"
  },
  "trello": {
    "key": "",
    "token": "",
    "baseUrl": "http://127.0.0.1:5000/mock-api",
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
    "baseUrl": "http://127.0.0.1:5000/mock-api"
  },
  "drive": {
    "folders" : {
      "contractors": "",
      "forms": ""
    },
    "files" : {
      "task": {
        "name": "Tasks",
        "id": "test"
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

