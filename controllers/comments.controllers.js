const { deleteComment } = require('../models/comments.models');

exports.removeComment = (req, res, next) => {
   const { comment_id } = req.params;
    deleteComment(comment_id).then((result) => {
        res.sendStatus(result.status);
    })

    
}