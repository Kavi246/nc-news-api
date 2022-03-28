const db = require('../db/connection')

exports.selectAllTopics = () => {
    return db.query('SELECT * FROM topics')
        .then((result) => {
            console.log(result.rows, "<model log")
            return result.rows;
        })
}