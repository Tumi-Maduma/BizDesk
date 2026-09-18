const ticketCommentModel =
    require('../models/ticketCommentModel');


const getTicketComments = async (
    req,
    res
) => {

    try {

        const ticketId =
            Number(req.params.id);


        if (!ticketId) {

            return res.status(400).json({
                message: 'Invalid ticket ID'
            });

        }


        const comments =
            await ticketCommentModel
                .getCommentsByTicketId(
                    ticketId
                );


        res.json(comments);

    } catch (error) {

        console.error(
            'Error retrieving ticket comments:',
            error
        );

        res.status(500).json({
            message:
                'Failed to retrieve ticket comments'
        });

    }

};


const createTicketComment = async (
    req,
    res
) => {

    try {

        const ticketId =
            Number(req.params.id);


        const {
            comment
        } = req.body;


        if (!ticketId) {

            return res.status(400).json({
                message: 'Invalid ticket ID'
            });

        }


        if (!comment || !comment.trim()) {

            return res.status(400).json({
                message: 'Comment is required'
            });

        }


        const newComment =
            await ticketCommentModel
                .createComment(
                    ticketId,
                    req.user.id,
                    comment.trim()
                );


        res.status(201).json(
            newComment
        );

    } catch (error) {

        console.error(
            'Error creating ticket comment:',
            error
        );

        res.status(500).json({
            message:
                'Failed to create ticket comment'
        });

    }

};


module.exports = {
    getTicketComments,
    createTicketComment
};