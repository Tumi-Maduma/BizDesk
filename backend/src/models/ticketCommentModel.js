const pool = require('../config/db');


const createComment = async (
    ticketId,
    userId,
    comment
) => {

    const result = await pool.query(`
        INSERT INTO ticket_comments (
            ticket_id,
            user_id,
            comment
        )

        VALUES ($1, $2, $3)

        RETURNING
            id,
            ticket_id,
            user_id,
            comment,
            created_at
    `, [
        ticketId,
        userId,
        comment
    ]);

    return result.rows[0];
};


const getCommentsByTicketId = async (
    ticketId
) => {

    const result = await pool.query(`
        SELECT
            c.id,
            c.ticket_id,
            c.user_id,
            c.comment,
            c.created_at,

            u.full_name AS user_name,
            u.role AS user_role

        FROM ticket_comments c

        INNER JOIN users u
            ON c.user_id = u.id

        WHERE c.ticket_id = $1

        ORDER BY c.created_at ASC
    `, [ticketId]);

    return result.rows;
};


module.exports = {
    createComment,
    getCommentsByTicketId
};