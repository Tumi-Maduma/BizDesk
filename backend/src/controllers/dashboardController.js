const dashboardModel =
    require('../models/dashboardModel');


const getTicketStatistics = async (
    req,
    res
) => {

    try {

        const statistics =
            await dashboardModel
                .getTicketStatistics(
                    req.user
                );


        res.json(statistics);

    } catch (error) {

        console.error(
            'Error retrieving dashboard statistics:',
            error
        );

        res.status(500).json({
            message:
                'Failed to retrieve dashboard statistics'
        });

    }

};


module.exports = {
    getTicketStatistics
};