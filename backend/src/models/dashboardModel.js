const pool = require('../config/db');


const getTicketStatistics = async (user) => {

    let query;
    let values = [];


    if (user.role === 'ADMIN') {

        query = `
            SELECT
                COUNT(*) AS total,

                COUNT(*) FILTER (
                    WHERE status = 'OPEN'
                ) AS open,

                COUNT(*) FILTER (
                    WHERE status = 'ASSIGNED'
                ) AS assigned,

                COUNT(*) FILTER (
                    WHERE status = 'IN_PROGRESS'
                ) AS in_progress,

                COUNT(*) FILTER (
                    WHERE status = 'RESOLVED'
                ) AS resolved,

                COUNT(*) FILTER (
                    WHERE status = 'CLOSED'
                ) AS closed,

                COUNT(*) FILTER (
                    WHERE priority = 'LOW'
                ) AS low,

                COUNT(*) FILTER (
                    WHERE priority = 'MEDIUM'
                ) AS medium,

                COUNT(*) FILTER (
                    WHERE priority = 'HIGH'
                ) AS high,

                COUNT(*) FILTER (
                    WHERE priority = 'CRITICAL'
                ) AS critical

            FROM tickets
        `;

    } else if (user.role === 'TECHNICIAN') {

        query = `
            SELECT
                COUNT(*) AS total,

                COUNT(*) FILTER (
                    WHERE status = 'OPEN'
                ) AS open,

                COUNT(*) FILTER (
                    WHERE status = 'ASSIGNED'
                ) AS assigned,

                COUNT(*) FILTER (
                    WHERE status = 'IN_PROGRESS'
                ) AS in_progress,

                COUNT(*) FILTER (
                    WHERE status = 'RESOLVED'
                ) AS resolved,

                COUNT(*) FILTER (
                    WHERE status = 'CLOSED'
                ) AS closed,

                COUNT(*) FILTER (
                    WHERE priority = 'LOW'
                ) AS low,

                COUNT(*) FILTER (
                    WHERE priority = 'MEDIUM'
                ) AS medium,

                COUNT(*) FILTER (
                    WHERE priority = 'HIGH'
                ) AS high,

                COUNT(*) FILTER (
                    WHERE priority = 'CRITICAL'
                ) AS critical

            FROM tickets

            WHERE assigned_to = $1
        `;

        values = [user.id];

    } else {

        query = `
            SELECT
                COUNT(*) AS total,

                COUNT(*) FILTER (
                    WHERE status = 'OPEN'
                ) AS open,

                COUNT(*) FILTER (
                    WHERE status = 'ASSIGNED'
                ) AS assigned,

                COUNT(*) FILTER (
                    WHERE status = 'IN_PROGRESS'
                ) AS in_progress,

                COUNT(*) FILTER (
                    WHERE status = 'RESOLVED'
                ) AS resolved,

                COUNT(*) FILTER (
                    WHERE status = 'CLOSED'
                ) AS closed,

                COUNT(*) FILTER (
                    WHERE priority = 'LOW'
                ) AS low,

                COUNT(*) FILTER (
                    WHERE priority = 'MEDIUM'
                ) AS medium,

                COUNT(*) FILTER (
                    WHERE priority = 'HIGH'
                ) AS high,

                COUNT(*) FILTER (
                    WHERE priority = 'CRITICAL'
                ) AS critical

            FROM tickets

            WHERE requester_id = $1
        `;

        values = [user.id];

    }


    const result =
        await pool.query(
            query,
            values
        );


    return result.rows[0];

};


module.exports = {
    getTicketStatistics
};