module.exports = blanks =>
  `Hello ${blanks.name},

A new e-mail account has been set up for you. Your address is:

${blanks.address}

Your temporary password is:

${blanks.password}

If you have any questions, please let me know.

Thanks!`;
