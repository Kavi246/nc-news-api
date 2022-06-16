const res = require('express/lib/response');
const db = require('../db/connection');

exports.deleteComment = async (comment_id) => {
    const deleteCom = await db.query(`
        DELETE FROM comments
        WHERE comment_id = $1;
    `, [comment_id])
    return Promise.resolve({status: 204, msg:'Comment has been deleted'})
}