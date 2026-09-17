const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();

        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);

        res.status(500).json({
            message: 'Failed to retrieve users'
        });
    }
};

const createUser = async (req, res) => {
    try{
        const {
            full_name,
            email,
            password,
            role,
            department,
        } = req.body;

        if (!full_name || !email || !password)
        {
            return res.status(400).json({
                message: 'Full name, email and password are required'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.createUser(
            full_name,
            email,
            hashedPassword,
            role || 'EMPLOYEE',
            department || null
        );

        res.status(201).json(newUser);
    }catch (error){
        console.error('Error creating user:', error);

        res.status(500).json({
            message: 'Failed to create user'
        });
    }
};

module.exports = {
    getUsers,
    createUser
};