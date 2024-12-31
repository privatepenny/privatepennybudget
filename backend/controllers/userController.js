const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')


// JWT Creation
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'})
}

// Login User
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({ email, token, theme: user.theme })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('No user found with this email.');

        // Generate a temporary token (valid for 15 minutes)
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '15m' });

        // Send email (configure nodemailer SMTP settings)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://localhost:3000/reset-password/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded) {
            throw new Error('Invalid token');
        }

        const user = await User.findById(decoded._id);
        if (!user) throw new Error('User not found.');
        // Update password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Sign Up User
const registerUser = async (req, res) => {
    const {email, password, nickname, theme} = req.body

    try {
        const user = await User.register(email, password, nickname, theme)
        const token = createToken(user._id)
        res.status(200).json({ email, theme, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update Account Settings
const updateUser = async (req, res) => {

    const {email, password, nickname, theme} = req.body
    const userId = req.user._id

    try {
        const user = await User.findById(userId)
        await user.update(email, password, nickname, theme)

        const token = createToken(user._id)
        return res.status(200).json({email: user.email, theme: user.theme, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete Account
const deleteUser = async (req, res) => {
    const { password } = req.body
    const userId = req.user._id

    try {
        const user = await User.findById(userId)
        const response = await user.deleteUser(password)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { loginUser, forgotPassword, resetPassword, registerUser, updateUser, deleteUser }