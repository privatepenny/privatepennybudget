const Transaction = require('../models/transactionModel')
const mongoose = require('mongoose')

//GET ALL transactions.
const getTransactions = async (req, res) => {
    const user_id = req.user._id
    const transactions = await Transaction.find({ user_id }).sort({createdAt: -1})    
    res.status(200).json(transactions)
}

//GET SINGLE transaction.
const getTransaction = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such transaction.'})
    }
    const transaction = await Transaction.findById(id)
    if (!transaction) {
        return res.status(404).json({error: 'No such workout.'})
    }
    res.status(200).json(transaction)
}

//CREATE transaction.
const createTransaction = async (req, res) => {
    const {date, title, category, note, value} = req.body

    let emptyFields = []
    if(!title) {
        emptyFields.push('title')
    }
    if (!date) {
        emptyFields.push('date')
    }
    if (!category) {
        emptyFields.push('category')
    }
    if (!value) {
        emptyFields.push('value')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all the required fields.', emptyFields})
    }

    try {
        const user_id = req.user._id
        const transaction = await Transaction.create({
            date: new Date(date).toISOString().split('T')[0],
            title,
            category,
            note,
            value,
            user_id})
        
        res.status(200).json(transaction)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//DELETE transaction.
const deleteTransaction = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such transaction.'})
    }
    const transaction = await Transaction.findOneAndDelete({_id: id})
    if (!transaction) {
        return res.status(404).json({error: 'No such transaction.'})
    }
    res.status(200).json(transaction)
}

//UPDATE transaction.
const updateTransaction = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such transaction.'})
    }
    const transaction = await Transaction.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    if (!transaction) {
        return res.status(404).json({error: 'No such transaction.'})
    }
    res.status(200).json(transaction)
}

//Export
module.exports = {
    getTransactions,
    getTransaction,
    createTransaction,
    deleteTransaction,
    updateTransaction
}