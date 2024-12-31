const mongoose = require('mongoose')
const Schema = mongoose.Schema

const goalsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amountGoal: {
        type: Number,
        required: true
    },
    amountActual: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Goals', goalsSchema)