const db = require('../db/connection')

exports.selectArticleById = async (article_id) => {
    const article = await db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id]);
    if(article.rows.length === 0) {
        return Promise.reject({status: 404, msg: "Article not found"})
    }
    return article.rows[0]
}