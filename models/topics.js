const db = require('../db/connection')

exports.selectAllTopics = async () => {
    const allTopics = await db.query('SELECT * FROM topics');
    return allTopics.rows;
}