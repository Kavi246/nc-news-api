const db = require('../db/connection')

exports.selectAllUsers = () => {
    return db.query(`SELECT username FROM users;`)
    .then((result) => {
        return result.rows
    })
}