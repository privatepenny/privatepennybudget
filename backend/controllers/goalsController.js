const Goal = require('../models/goalsModel')
const mongoose = require('mongoose')

//GET ALL goals.
const getGoals = async (req, res) => {
    const user_id = req.user._id
    const goal = await Goal.find({ user_id }).sort({createdAt: -1})
    res.status(200).json(goal)
}

//GET SINGLE goal.
const getGoal = async (req, res) => {
    const { id } = req.params
    const user_id = req.user._id
    const goal = await Goal.findOne({_id: id, user_id});
    if (!goal) {
        return res.status(404).json({message: "Goal not found."})
    }
    res.status(200).json(goal)
}

//CREATE goal.
const createGoal = async (req, res) => {
    const {name, amountGoal, amountActual} = req.body

    let emptyFields = []
    if(!name) {
        emptyFields.push('name')
    }
    if (!amountGoal) {
        emptyFields.push('amountGoal')
    }
    if (!amountActual) {
        emptyFields.push('amountActual')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all fields.', emptyFields})
    }

    try {
        const user_id = req.user._id
        const goal = await Goal.create({name, amountGoal, amountActual, user_id})
        
        res.status(200).json(goal)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//DELETE goal.
const deleteGoal = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such goal.'})
    }
    const goal = await Goal.findOneAndDelete({_id: id})
    if (!goal) {
        return res.status(404).json({error: 'No such goal.'})
    }
    res.status(200).json(goal)
}

//UPDATE goal.
const updateGoal = async (req, res) => {
    const { id } = req.params;
    const { name, amountGoal, amountActual } = req.body;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such goal.' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (amountGoal !== undefined) updateFields.amountGoal = amountGoal;
    if (amountActual !== undefined) updateFields.amountActual = amountActual;

    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: id, user_id },
            { $set: updateFields },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: 'No such goal.' });
        }

        res.status(200).json(goal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Export
module.exports = {
    getGoals,
    getGoal,
    createGoal,
    deleteGoal,
    updateGoal
}