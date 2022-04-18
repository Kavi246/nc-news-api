const { selectArticleById, updateArticleById, selectAllArticles, selectCommentsByArticle, insertCommentForArticle} = require('../models/articles.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}

exports.patchArticleById = (req, res, next) => {
    
    const { article_id } = req.params;

    if(!req.body.hasOwnProperty('inc_votes')) {
        return next({status: 400, msg: 'patch request body incorrectly formatted'})
    }
    else if( typeof req.body.inc_votes !== 'number') {
        return next({status: 400, msg: 'value for the vote increment must be a number!'})
    }
    const { inc_votes } = req.body;

    const dbQueries = [ 
        updateArticleById(article_id, inc_votes), 
        selectArticleById(article_id)
    ]
    Promise.all(dbQueries)
        .then((results) => {
            const updatedArticle = results[0]
            res.status(200).send( { updatedArticle } )
        })
        .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.send( {articles } );
    })
    .catch(next);
}

exports.getCommentsForArticle = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticle(article_id).then((result) => {
        if(Array.isArray(result)) {
            const comments = result;
            res.send( { comments } );
        }
        else {
            console.log(result.msg)
            res.status(result.status).send({msg: result.msg})
        }
    })
    .catch(next);
}

exports.postCommentsForArticle = (req, res, next) => {
    const { article_id } = req.params;

    if((!req.body.hasOwnProperty('username'))||(!req.body.hasOwnProperty('body'))) {
        return next({status: 400, msg: 'The comment to be posted was incorrectly formatted'})
    }
    else if(typeof req.body.username !== 'string') {
        return next({status: 400, msg: 'The username must be a string'})
    }
    else if(typeof req.body.body !== 'string') {
        return next({status: 400, msg: 'The comment body must be a string'})
    }

    const newComment = req.body;

    insertCommentForArticle(article_id, newComment)
    .then((postedComment) => {
        res.status(201).send({ postedComment })
    })
    .catch(next)
}