import { useEffect } from 'react'
import { useBudgetContext } from '../../hooks/useBudgetContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import BudgetListItem from "./BudgetListItem"


const BudgetList = ({ onCreateClick, onSelectBudget }) => {

    const {budgets, dispatch} = useBudgetContext()
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchBudgets = async () => {
            const response = await fetch('/budgets', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_BUDGETS', payload: json})
            }
        }

        if (user) {
            fetchBudgets()
        }
    }, [dispatch, user])

    const getMonthNumber = (month) => {
        const monthMap = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        }
        return monthMap[month] || 0 // Default to 0 for invalid month names
    }

    const sortedBudgets = budgets
    ? [...budgets].sort((a, b) => {
        if (b.year !== a.year) {
            return b.year - a.year
        }
        return getMonthNumber(b.month) - getMonthNumber(a.month)
    })
    : []

    return (
        <div className='w-full overflow-y-auto h-[calc(100vh-80px)]'>
            <h1 className="text-center text-lg my-4 font-bold text-bodyTextLight">Monthly Budget List</h1>
            <button 
                onClick={onCreateClick} 
                className="w-full bg-light2 text-bodyTextDark p-2 hover:bg-light3"
            >
                Create A Budget
            </button>
            <div className='bg-dark3 py-4'>
                {sortedBudgets.map((budget) => (
                    <BudgetListItem key={budget._id} budget={budget} onSelectBudget={onSelectBudget}/>
                ))}
            </div>
        </div>
    )

}

export default BudgetList