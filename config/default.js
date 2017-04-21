module.exports = {
  "google": {
    "redirectUri": "http://surfboard.reardenapps.com:5000/oauth2callback",
    "scope": "https://www.googleapis.com/auth/drive https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user",
    "baseUrl": "https://www.googleapis.com"
  },
  "trello": {
    "baseUrl": "https://api.trello.com/1"
  },
  "slack": {
    "baseUrl": "https://slack.com/api"
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
      },
      {
        "name": "addUserToClickTime",
        "text": "Add user to ClickTime"
      }
    ]
  }
};