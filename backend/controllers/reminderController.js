const Reminder = require('../models/reminderModel')
const mongoose = require('mongoose')

//GET ALL reminders.
const getReminders = async (req, res) => {
    const user_id = req.user._id
    const reminder = await Reminder.find({ user_id }).sort({createdAt: -1})
    res.status(200).json(reminder)
}

//GET SINGLE reminder.
const getReminder = async (req, res) => {
    const { id } = req.params
    const user_id = req.user._id
    const reminder = await Reminder.findOne({_id: id, user_id});
    if (!reminder) {
        return res.status(404).json({message: "Reminder not found."})
    }
    res.status(200).json(reminder)
}

//CREATE reminder.
const createReminder = async (req, res) => {
    const {name, date, amount} = req.body

    let emptyFields = []
    if(!name) {
        emptyFields.push('name')
    }
    if (!date) {
        emptyFields.push('amountGoal')
    }
    if (!amount) {
        emptyFields.push('amountActual')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all fields.', emptyFields})
    }

    try {
        const user_id = req.user._id
        const checkbox = false
        const reminder = await Reminder.create({name, date, amount, checkbox, user_id})
        
        res.status(200).json(reminder)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//DELETE goal.
const deleteReminder = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such reminder.'})
    }
    const reminder = await Reminder.findOneAndDelete({_id: id})
    if (!reminder) {
        return res.status(404).json({error: 'No such reminder.'})
    }
    res.status(200).json(reminder)
}

//UPDATE goal.
const updateReminder = async (req, res) => {
    const { id } = req.params;
    const { name, date, amount, checkbox } = req.body;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such reminder.' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (date !== undefined) updateFields.date = date;
    if (amount !== undefined) updateFields.amount = amount;
    if (checkbox !== undefined) updateFields.checkbox = checkbox;

    try {
        const reminder = await Reminder.findOneAndUpdate(
            { _id: id, user_id },
            { $set: updateFields },
            { new: true }
        );

        if (!reminder) {
            return res.status(404).json({ error: 'No such reminder.' });
        }

        res.status(200).json(reminder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Export
module.exports = {
    getReminders,
    getReminder,
    createReminder,
    deleteReminder,
    updateReminder
}