import { useAuthContext } from '../../hooks/useAuthContext'
import { useBudgetContext } from '../../hooks/useBudgetContext'

const BudgetListItem = ({ budget, onSelectBudget }) => {
    const { dispatch } = useBudgetContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }

        const isConfirmed = window.confirm(`Are you sure you want to delete the budget for ${budget.month} ${budget.year}?`)
        if (!isConfirmed) {
            return
        }

        const response = await fetch('https://privatepennybudget-backend.onrender.com/budgets/' + budget._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_BUDGET', payload: json})
        }
    }

    const handleSetDefault = async () => {
        if (!user) return;

        const response = await fetch(`https://privatepennybudget-backend.onrender.com/budgets/${budget._id}/default`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'SET_DEFAULT_BUDGET', payload: json });
            const fetchBudgets = async () => {
                const response = await fetch('https://privatepennybudget-backend.onrender.com/budgets', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                const json = await response.json();
                if (response.ok) {
                    dispatch({ type: 'SET_BUDGETS', payload: json });
                }
            };
            fetchBudgets();
        }
    };

    return (
        <div className='flex items-center bg-dark1 w-full'>
            <button 
                onClick={handleClick} 
                className="p-2 material-symbols-outlined text-bodyTextLight hover:bg-dark2"
                aria-label="Delete Budget"
            >
                delete
            </button>
            <button 
                onClick={() => onSelectBudget(budget)} 
                className="w-full text-left p-2 bg-dark1 text-bodyTextLight hover:bg-dark2"
            >
                {budget.month} {budget.year}
            </button>
            <button 
                onClick={handleSetDefault} 
                className='p-2 material-symbols-outlined text-bodyTextLight hover:bg-dark2'
                aria-label="Set Default Budget"
            >
                {budget.isDefault ? 'stars' : 'star'}
            </button>
        </div>
    )
}

export default BudgetListItem