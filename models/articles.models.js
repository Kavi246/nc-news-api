const db = require('../db/connection')

exports.selectArticleById = async (article_id) => {
    const article = await db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id]);
    if(article.rows.length === 0) {
        return Promise.reject({status: 404, msg: "Article not found"})
    }
    return article.rows[0]
}

exports.updateArticleById = async (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
            SET votes = votes + $1 
        WHERE article_id = $2 
        RETURNING *;`
        , [ inc_votes, article_id ]
        )
        .then((result) => {
            return result.rows[0]
        })
}