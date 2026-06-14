const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
    try {
        const { name, email, password, role = 'user' } = req.body;

        const isUserAlreadyExists = await userModel.findOne({ email });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hash,
            role
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        );

        res.cookie('token', token);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: 'Invalid credentials'
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET
    );

    res.cookie('token', token);

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}
module.exports = {
    registerUser,
    loginUser
};
