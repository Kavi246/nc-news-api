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

exports.selectAllArticles = async (sort_by = 'created_at', order='DESC', topic) => {
    const validColumns = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count'];
    if(!validColumns.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'invalid sort_by, column doesn\'t exist'});
    }
    const currentTopics = await db.query('SELECT * FROM topics;')
    const validTopics = currentTopics.rows.map(topic => topic.slug);
    

    
    let queryStr = `
    SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles LEFT JOIN comments 
        ON comments.article_id = articles.article_id`;
    const queryValues = [];
    
    if (topic) {
        if(!validTopics.includes(topic)) {
            return Promise.reject({status: 404, msg: "topic you are trying to filter by does not exist"})
        }
        queryStr += ` WHERE topic = $1`;
        queryValues.push(topic);
    }

    queryStr += ` GROUP BY articles.article_id`
    
    queryStr += ` ORDER BY ${sort_by}`;
    
    if(order){
        if (/^desc$/i.test(order) || /^asc$/i.test(order)) {
            queryStr += ` ${order};`;
        }
        else {
            return Promise.reject({status: 400, msg: `you cannot order by: ${order}`})
        }
    }

    const allArticles = await db.query(queryStr, queryValues)
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