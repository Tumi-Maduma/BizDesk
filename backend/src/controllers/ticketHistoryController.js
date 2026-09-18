const ticketHistoryModel =
    require('../models/ticketHistoryModel');


const getTicketHistory = async (req, res) => {

    try {

        const ticketId =
            Number(req.params.id);


        if (!ticketId) {

            return res.status(400).json({
                message: 'Invalid ticket ID'
            });

        }


        const history =
            await ticketHistoryModel.getHistoryByTicketId(
                ticketId
            );


        res.json(history);

    } catch (error) {

        console.error(
            'Error retrieving ticket history:',
            error
        );

        res.status(500).json({
            message: 'Failed to retrieve ticket history'
        });

    }

};


module.exports = {
    getTicketHistory
};