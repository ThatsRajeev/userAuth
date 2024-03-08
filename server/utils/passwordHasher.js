const bcrypt = require('bcrypt');

const saltRounds = 10; 

async function hashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
}

module.exports = { hashPassword };
