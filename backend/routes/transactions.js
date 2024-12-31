const express = require('express')
const { getTransactions, getTransaction, createTransaction, deleteTransaction, updateTransaction } = require('../controllers/transactionController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth)

/************************************************************************
*************************************************************************
The following is example routes that include GET ALL, GET SINGLE, POST, DELETE SINGLE, and PATCH (update) routes. Update as necesary.
*************************************************************************
**************************************************************************/

            //GET all transactions.
            router.get('/', getTransactions)

            //GET a single transactions.
            router.get('/:id', getTransaction)

            //POST a single transactions.
            router.post('/', createTransaction)

            //DELETE a transaction.
            router.delete('/:id', deleteTransaction)

            //UPDATE a single transactions.
            router.patch('/', updateTransaction)
/************************************************************************
*************************************************************************/




module.exports = router