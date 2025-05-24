const bcrypt = require('bcrypt');

const users = [
  {
    username: 'admin',
    passwordHash: bcrypt.hashSync(process.env.LOCAL_PASSWORD, 10)
  }
];

module.exports = users;
