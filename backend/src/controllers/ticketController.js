const ticketModel = require('../models/ticketModel');

const ticketHistoryModel = require('../models/ticketHistoryModel');

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
                message:
                    'Title, description and category are required'
            });

        }


        const newTicket =
            await ticketModel.createTicket(
                title,
                description,
                category,
                priority || 'MEDIUM',
                req.user.id
            );


        await ticketHistoryModel.createHistory(
            newTicket.id,
            req.user.id,
            'TICKET_CREATED',
            null,
            'OPEN',
            'Ticket created'
        );


        res.status(201).json(newTicket);

    } catch (error) {

        console.error(
            'Error creating ticket:',
            error
        );

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

const assignTicket = async (req, res) => {

    try {

        const ticketId =
            Number(req.params.id);

        const {
            technician_id
        } = req.body;


        if (!technician_id) {

            return res.status(400).json({
                message: 'Technician is required'
            });

        }


        const technician =
            await ticketModel.getTechnicianById(
                technician_id
            );


        if (!technician) {

            return res.status(400).json({
                message:
                    'Selected user is not a technician'
            });

        }


        const updatedTicket =
            await ticketModel.assignTicket(
                ticketId,
                technician_id
            );


        if (!updatedTicket) {

            return res.status(404).json({
                message: 'Ticket not found'
            });

        }


        await ticketHistoryModel.createHistory(
            ticketId,
            req.user.id,
            'TICKET_ASSIGNED',
            'OPEN',
            'ASSIGNED',
            `Ticket assigned to ${technician.full_name}`
        );


        res.json({

            message:
                'Ticket assigned successfully',

            ticket: updatedTicket

        });

    } catch (error) {

        console.error(
            'Error assigning ticket:',
            error
        );

        res.status(500).json({
            message:
                'Failed to assign ticket'
        });

    }

};

const updateTicketStatus = async (req, res) => {

    try {

        const ticketId =
            Number(req.params.id);


        const {
            status
        } = req.body;


        if (!status) {

            return res.status(400).json({
                message: 'Status is required'
            });

        }


        const allowedStatuses = [
            'IN_PROGRESS',
            'RESOLVED',
            'CLOSED'
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: 'Invalid status'
            });

        }


        const ticket =
            await ticketModel.getTicketById(
                ticketId,
                req.user
            );


        if (!ticket) {

            return res.status(404).json({
                message: 'Ticket not found'
            });

        }


        const oldStatus =
            ticket.status;


        /*
         * TECHNICIAN
         *
         * ASSIGNED → IN_PROGRESS
         * IN_PROGRESS → RESOLVED
         */

        if (req.user.role === 'TECHNICIAN') {

            if (
                status === 'IN_PROGRESS' &&
                ticket.status !== 'ASSIGNED'
            ) {

                return res.status(400).json({
                    message:
                        'Ticket must be ASSIGNED before work can start'
                });

            }


            if (
                status === 'RESOLVED' &&
                ticket.status !== 'IN_PROGRESS'
            ) {

                return res.status(400).json({
                    message:
                        'Ticket must be IN_PROGRESS before it can be resolved'
                });

            }

        }


        /*
         * ADMIN
         *
         * RESOLVED → CLOSED
         */

        if (req.user.role === 'ADMIN') {

            if (
                status === 'CLOSED' &&
                ticket.status !== 'RESOLVED'
            ) {

                return res.status(400).json({
                    message:
                        'Ticket must be RESOLVED before it can be closed'
                });

            }

        }


        /*
         * EMPLOYEES ARE NOT ALLOWED
         * TO CHANGE TICKET STATUS
         */

        if (req.user.role === 'EMPLOYEE') {

            return res.status(403).json({
                message:
                    'Employees cannot change ticket status'
            });

        }


        const updatedTicket =
            await ticketModel.updateTicketStatus(
                ticketId,
                status
            );


        /*
         * CREATE HISTORY RECORD
         */

        let description = '';


        if (
            oldStatus === 'ASSIGNED' &&
            status === 'IN_PROGRESS'
        ) {

            description =
                `${req.user.full_name || req.user.email} started working on the ticket`;

        } else if (
            oldStatus === 'IN_PROGRESS' &&
            status === 'RESOLVED'
        ) {

            description =
                `${req.user.full_name || req.user.email} resolved the ticket`;

        } else if (
            oldStatus === 'RESOLVED' &&
            status === 'CLOSED'
        ) {

            description =
                `${req.user.full_name || req.user.email} closed the ticket`;

        } else {

            description =
                `Ticket status changed from ${oldStatus} to ${status}`;

        }


        await ticketHistoryModel.createHistory(
            ticketId,
            req.user.id,
            'STATUS_CHANGED',
            oldStatus,
            status,
            description
        );


        res.json({

            message:
                'Ticket status updated successfully',

            ticket: updatedTicket

        });

    } catch (error) {

        console.error(
            'Error updating ticket status:',
            error
        );

        res.status(500).json({

            message:
                'Failed to update ticket status'

        });

    }

};

module.exports = {
    getTickets,
    createTicket,
    getTicket,
    assignTicket,
    updateTicketStatus
};