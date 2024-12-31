import { useTransactionsContext } from '../../hooks/useTransactionsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const TransactionDetails = ({ transaction }) => {
    const { dispatch } = useTransactionsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }

        const response = await fetch('/transactions/' + transaction._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_EXPENSE', payload: json})
        }
    }

    return (
        <div className='flex justify-around md:grid md:grid-cols-12 border border-light2 items-center w-full text-bodyTextDark'>
            <p className='mx-1 col-span-1'>{new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</p>
            <p className='col-span-3'>{transaction.title}</p>
            <p className='mx-1 col-span-2'>{transaction.category}</p>
            <p className='mx-1 col-span-3'>{transaction.note ? transaction.note : ''}</p>
            <p className='col-span-1 justify-self-end'>$</p>
            <p className='col-span-1 justify-self-end'>{transaction.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <span className="col-span-1 material-symbols-outlined cursor-pointer justify-self-end hover:text-warningColor" onClick={handleClick}>delete</span>
        </div>
    )
}

export default TransactionDetails