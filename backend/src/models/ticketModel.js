const pool = require('../config/db');

const getAllTickets = async (user) => {

    let query;
    let values = [];

    if (user.role === 'ADMIN') {

        query = `
            SELECT
                t.id,
                t.ticket_number,
                t.title,
                t.description,
                t.category,
                t.priority,
                t.status,
                t.created_at,
                t.updated_at,

                requester.full_name AS requester_name,
                assigned.full_name AS assigned_to_name

            FROM tickets t

            INNER JOIN users requester
                ON t.requester_id = requester.id

            LEFT JOIN users assigned
                ON t.assigned_to = assigned.id

            ORDER BY t.created_at DESC
        `;

    } else if (user.role === 'TECHNICIAN') {

        query = `
            SELECT
                t.id,
                t.ticket_number,
                t.title,
                t.description,
                t.category,
                t.priority,
                t.status,
                t.created_at,
                t.updated_at,

                requester.full_name AS requester_name,
                assigned.full_name AS assigned_to_name

            FROM tickets t

            INNER JOIN users requester
                ON t.requester_id = requester.id

            LEFT JOIN users assigned
                ON t.assigned_to = assigned.id

            WHERE t.assigned_to = $1

            ORDER BY t.created_at DESC
        `;

        values = [user.id];

    } else {

        query = `
            SELECT
                t.id,
                t.ticket_number,
                t.title,
                t.description,
                t.category,
                t.priority,
                t.status,
                t.created_at,
                t.updated_at,

                requester.full_name AS requester_name,
                assigned.full_name AS assigned_to_name

            FROM tickets t

            INNER JOIN users requester
                ON t.requester_id = requester.id

            LEFT JOIN users assigned
                ON t.assigned_to = assigned.id

            WHERE t.requester_id = $1

            ORDER BY t.created_at DESC
        `;

        values = [user.id];
    }

    const result = await pool.query(query, values);

    return result.rows;
};


const createTicket = async (
    title,
    description,
    category,
    priority,
    requesterId
) => {

    const result = await pool.query(`
        INSERT INTO tickets (
            title,
            description,
            category,
            priority,
            requester_id
        )

        VALUES ($1, $2, $3, $4, $5)

        RETURNING
            id,
            ticket_number,
            title,
            description,
            category,
            priority,
            status,
            requester_id,
            assigned_to,
            created_at,
            updated_at
    `, [
        title,
        description,
        category,
        priority,
        requesterId
    ]);

    return result.rows[0];
};


const getTicketById = async (id, user) => {

    let query;
    let values = [id];

    if (user.role === 'ADMIN') {

        query = `
            SELECT
                t.id,
                t.ticket_number,
                t.title,
                t.description,
                t.category,
                t.priority,
                t.status,
                t.created_at,
                t.updated_at,

                requester.full_name AS requester_name,
                requester.email AS requester_email,

                assigned.full_name AS assigned_to_name

            FROM tickets t

            INNER JOIN users requester
                ON t.requester_id = requester.id

            LEFT JOIN users assigned
                ON t.assigned_to = assigned.id

            WHERE t.id = $1
        `;

    } else if (user.role === 'TECHNICIAN') {

        query = `
            SELECT
                t.id,
                t.ticket_number,
                t.title,
                t.description,
                t.category,
                t.priority,
                t.status,
                t.created_at,
                t.updated_at,

                requester.full_name AS requester_name,
                requester.email AS requester_email,

                assigned.full_name AS assigned_to_name

            FROM tickets t

            INNER JOIN users requester
                ON t.requester_id = requester.id

            LEFT JOIN users assigned
                ON t.assigned_to = assigned.id

            WHERE t.id = $1
            AND t.assigned_to = $2
        `;

        values = [id, user.id];

    } else {

        query = `
            SELECT
                t.id,
                t.ticket_number,
                t.title,
                t.description,
                t.category,
                t.priority,
                t.status,
                t.created_at,
                t.updated_at,

                requester.full_name AS requester_name,
                requester.email AS requester_email,

                assigned.full_name AS assigned_to_name

            FROM tickets t

            INNER JOIN users requester
                ON t.requester_id = requester.id

            LEFT JOIN users assigned
                ON t.assigned_to = assigned.id

            WHERE t.id = $1
            AND t.requester_id = $2
        `;

        values = [id, user.id];
    }

    const result = await pool.query(query, values);

    return result.rows[0];
};


module.exports = {
    getAllTickets,
    createTicket,
    getTicketById
};