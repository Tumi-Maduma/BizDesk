const ticketModel = require('../models/ticketModel');


const getTickets = async (req, res) => {

    try {

        const tickets = await ticketModel.getAllTickets(req.user);

        res.json(tickets);

    } catch (error) {

        console.error('Error retrieving tickets:', error);

        res.status(500).json({
            message: 'Failed to retrieve tickets'
        });
    }
};


const createTicket = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            priority
        } = req.body;


        if (!title || !description || !category) {

            return res.status(400).json({
                message: 'Title, description and category are required'
            });
        }


        const newTicket = await ticketModel.createTicket(
            title,
            description,
            category,
            priority || 'MEDIUM',
            req.user.id
        );


        res.status(201).json(newTicket);

    } catch (error) {

        console.error('Error creating ticket:', error);

        res.status(500).json({
            message: 'Failed to create ticket'
        });
    }
};


const getTicket = async (req, res) => {

    try {

        const ticket = await ticketModel.getTicketById(
            req.params.id,
            req.user
        );


        if (!ticket) {

            return res.status(404).json({
                message: 'Ticket not found'
            });
        }


        res.json(ticket);

    } catch (error) {

        console.error('Error retrieving ticket:', error);

        res.status(500).json({
            message: 'Failed to retrieve ticket'
        });
    }
};


module.exports = {
    getTickets,
    createTicket,
    getTicket
};