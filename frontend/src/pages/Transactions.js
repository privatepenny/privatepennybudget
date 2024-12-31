import { useEffect, useState } from 'react'
import { useTransactionsContext } from '../hooks/useTransactionsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import TransactionDetails from '../components/transactions/TransactionDetails'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionFilter from '../components/transactions/TransactionFilter'

const Transactions = () => {

    const {transactions, dispatch} = useTransactionsContext()
    const {user} = useAuthContext()

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        categories: [],
        minAmount: "",
        maxAmount: "",
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetch('/transactions', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_EXPENSES', payload: json})
            }
        }

        if (user) {
            fetchTransactions()
        }
    }, [dispatch, user])

    // Sort transactions by most recent.
    const sortedTransactions = transactions ? [...transactions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
    }) : []

    // Apply filters
    const filteredTransactions = sortedTransactions.filter((transaction) => {
        const { startDate, endDate, categories, minAmount, maxAmount } = filters;

        // Filter by date range
        const transactionDate = new Date(transaction.date);
        if (startDate && transactionDate < new Date(startDate)) return false;
        if (endDate && transactionDate > new Date(endDate)) return false;

        // Filter by categories
        if (categories.length > 0 && !categories.includes(transaction.category)) return false;

        // Filter by amount range
        if (minAmount && transaction.value < parseFloat(minAmount)) return false;
        if (maxAmount && transaction.value > parseFloat(maxAmount)) return false;

        return true;
    });

    return (
        <div className='flex flex-col w-full'>
                <TransactionFilter setFilters={setFilters} transactions={transactions} />
                <TransactionForm />
            <hr className='border-t-2 border-dark1 mt-2'/>
            <div className='w-full px-4'>
                <div className='flex text-bodyTextDark justify-evenly md:grid md:grid-cols-12 items-center w-full my-2 font-bold'>
                    <p className='col-span-1'>Date</p>
                    <p className='col-span-3'>Title</p>
                    <p className='col-span-2'>Category</p>
                    <p className='col-span-4'>Note</p>
                    <p className='col-span-1'>Value</p>
                    <span className="col-span-1"></span>
                </div>
                {filteredTransactions.map((transaction) => (
                    <TransactionDetails key={transaction._id} transaction={transaction} />
                ))}
            </div>
        </div>
    )
}

export default Transactions