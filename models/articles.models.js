const format = require("pg-format");
const app = require('../app');
const db = require('../db/connection');
const comments = require('../db/data/test-data/comments');

exports.selectArticleById = async (article_id) => {
    const article = await db.query(`
    SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles LEFT JOIN comments 
        ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id;`
    , [article_id]);
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

exports.selectAllArticles = async () => {
    const allArticles = await db.query(`
        SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
        FROM articles LEFT JOIN comments 
            ON comments.article_id = articles.article_id 
        GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;
    `)
    return allArticles.rows;
}

exports.selectCommentsByArticle = async (article_id) => {
    const commentsForArticle = await db.query(`
        SELECT * FROM comments 
        WHERE article_id = $1;
    `, [article_id])

    if(commentsForArticle.rows.length === 0) {
        const articleExists = await db.query(`
            SELECT * FROM articles 
            WHERE article_id = $1;
        `, [article_id]);
        if((articleExists).rows.length) {
            return Promise.resolve({status: 200, msg:'This article has no comments'})
        }
        return Promise.reject({status: 404, msg:"Article not found"})
    }
    return commentsForArticle.rows;
}

exports.insertCommentForArticle = (article_id, newComment) => {
    const insertQueryStr = format("INSERT INTO comments (body, author, article_id, votes, created_at) VALUES (%L) RETURNING *;"
    , [newComment.body, newComment.username, article_id, 0, new Date(Date.now())]);
    return db.query(insertQueryStr)
    .then(results => {
        return results.rows[0];
    })
    .catch((err) => {
        const missingDetail = err.detail.includes("article") ? "Article" : "User"
        return Promise.reject({status: 404, msg:`${missingDetail} does not exist`});
    })

}