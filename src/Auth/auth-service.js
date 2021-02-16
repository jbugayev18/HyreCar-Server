const bcrypt = require('bcryptjs')

const AuthService = {
    getUserWithEmail(db, email) {
        return db('car-users')
            .where({ email })
            .first()
    },

    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    }, 
    parseBasicToken(token)
}
module.exports = AuthService; 