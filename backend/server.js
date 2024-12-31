require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const budgetRoutes = require('./routes/budgets')
const transactionRoutes = require('./routes/transactions')
const userRoutes = require('./routes/user')
const goalRoutes = require('./routes/goals')
const reminderRoutes = require('./routes/reminders')

//Express App
const app = express()

//CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    // origin: 'https://privatepennybudget-frontend.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

//Middleware
app.use(cors(corsOptions))
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//Routes
app.use('/budgets',budgetRoutes)
app.use('/transactions',transactionRoutes)
app.use('/user',userRoutes)
app.use('/goals',goalRoutes)
app.use('/reminders',reminderRoutes)

// Host
app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
});

//Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        //Listening to requests.
        app.listen(process.env.PORT, () => {
            console.log('Private Penny is connected to the database and listening on port', process.env.PORT)
        })
    }).catch((error) => {
        console.log('ERROR LOCATION: server.js DATABASE CONNECTION SECTION\n', error)
    })