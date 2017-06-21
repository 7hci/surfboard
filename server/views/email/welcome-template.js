/* eslint-disable max-len */

module.exports = blanks =>
  `Hello ${blanks.name},

Welcome to the team! You can access your Google Drive folder at:

${blanks.folder || 'https://drive.google.com/drive/u/0/shared-with-me'} 

Inside, you will find three documents to fill out:

1. ${blanks.form}
2. Direct Deposit Form
3. Background Check Authorization Form

Please upload completed and signed copies of these three documents to the same folder.

If you have any questions, please feel free to reach out to me.

Thanks!`;
