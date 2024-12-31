const mongoose = require('mongoose')
const Schema = mongoose.Schema

const remindersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    checkbox: {
        type: Boolean,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Reminders', remindersSchema)