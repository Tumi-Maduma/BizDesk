const pool = require('../config/db');

const getAllUsers = async () => {
    const result = await pool.query(`
        SELECT 
            id,
            full_name,
            email,
            role,
            department,
            created_at
        FROM users
        ORDER BY id
    `);

    return result.rows;
};

const createUser = async (fullName, email, password, role, department) => {
    const result = await pool.query(`
        INSERT INTO users (
            full_name,
            email,
            password,
            role,
            department
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING 
            id,
            full_name,
            email,
            role,
            department,
            created_at
    `, [fullName, email, password, role, department]);

    return result.rows[0];
};

const getUserByEmail = async (email) => {
    const result = await pool.query(`
        SELECT
            id,
            full_name,
            email,
            password,
            role,
            department,
            created_at
        FROM users
        WHERE email = $1
    `, [email]);

    return result.rows[0];
};

module.exports = {
    getAllUsers,
    createUser,
    getUserByEmail
};