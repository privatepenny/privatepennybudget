const Budget = require('../models/budgetModel')
const mongoose = require('mongoose')

//GET ALL budgets.
const getBudgets = async (req, res) => {
    const user_id = req.user._id
    const budget = await Budget.find({ user_id }).sort({createdAt: -1})
    res.status(200).json(budget)
}

//GET SINGLE budget.
const getBudget = async (req, res) => {
    const { id } = req.params
    const user_id = req.user._id
    const budget = await Budget.findOne({_id: id, user_id});
    if (!budget) {
        return res.status(404).json({message: "Budget not found."})
    }
    res.status(200).json(budget)
}

//CREATE budget.
const createBudget = async (req, res) => {
    const {month, year, categories = [], budgetedIncome, isDefault} = req.body

    let emptyFields = []
    if(!month) {
        emptyFields.push('month')
    }
    if (!year) {
        emptyFields.push('year')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({error: 'Please enter a month and year.', emptyFields})
    }

    try {
        const user_id = req.user._id

        const defaultCategory = {
            name: "Add to Savings",
            amount: 0,
            color: '#000000',
            note: ''
        }

        const updatedCategories = categories.map((category) => ({
            ...category,
            note: category.note || '',
        }));

        const budget = await Budget.create({month, year, categories: updatedCategories, budgetedIncome, isDefault, user_id})
        
        res.status(200).json(budget)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//DELETE budget.
const deleteBudget = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such budget.'})
    }
    const budget = await Budget.findOneAndDelete({_id: id})
    if (!budget) {
        return res.status(404).json({error: 'No such budget.'})
    }
    res.status(200).json(budget)
}

//UPDATE budget.
const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { month, year, categories, budgetedIncome } = req.body;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such budget.' });
    }

    const updateFields = {};
    if (month !== undefined) updateFields.month = month;
    if (year !== undefined) updateFields.year = year;
    if (categories !== undefined) updateFields.categories = categories;
    if (budgetedIncome !== undefined) updateFields.budgetedIncome = budgetedIncome;

    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: id, user_id },
            { $set: updateFields },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ error: 'No such budget.' });
        }

        res.status(200).json(budget);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// SET DEFAULT budget
const setDefaultBudget = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such budget.' });
    }

    // Unset any previous default budgets for the user
    await Budget.updateMany({ user_id }, { $set: { isDefault: false } });

    // Set the new default budget
    const updatedBudget = await Budget.findOneAndUpdate(
        { _id: id, user_id },
        { $set: { isDefault: true } },
        { new: true }
    );

    if (!updatedBudget) {
        return res.status(404).json({ error: 'No such budget.' });
    }

    res.status(200).json(updatedBudget);
};

//Export
module.exports = {
    getBudgets,
    getBudget,
    createBudget,
    deleteBudget,
    updateBudget,
    setDefaultBudget
}