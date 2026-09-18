const pool = require('../config/db');


const createHistory = async (
    ticketId,
    userId,
    action,
    oldStatus,
    newStatus,
    description
) => {

    const result = await pool.query(`
        INSERT INTO ticket_history (
            ticket_id,
            user_id,
            action,
            old_status,
            new_status,
            description
        )

        VALUES ($1, $2, $3, $4, $5, $6)

        RETURNING
            id,
            ticket_id,
            user_id,
            action,
            old_status,
            new_status,
            description,
            created_at
    `, [
        ticketId,
        userId,
        action,
        oldStatus,
        newStatus,
        description
    ]);

    return result.rows[0];
};


const getHistoryByTicketId = async (ticketId) => {

    const result = await pool.query(`
        SELECT
            h.id,
            h.ticket_id,
            h.user_id,
            h.action,
            h.old_status,
            h.new_status,
            h.description,
            h.created_at,

            u.full_name AS user_name

        FROM ticket_history h

        LEFT JOIN users u
            ON h.user_id = u.id

        WHERE h.ticket_id = $1

        ORDER BY h.created_at ASC
    `, [ticketId]);

    return result.rows;
};


module.exports = {
    createHistory,
    getHistoryByTicketId
};