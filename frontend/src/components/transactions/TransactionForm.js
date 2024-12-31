import '../../index.css'
import { useState, useEffect } from "react"
import { useTransactionsContext } from '../../hooks/useTransactionsContext'
import { useBudgetContext } from '../../hooks/useBudgetContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const TransactionForm = () => {

    const { dispatch } = useTransactionsContext()
    const {budgets, dispatch: budgetDispatch} = useBudgetContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [category, setCategory] = useState('')
    const [note, setNote] = useState('')
    const [goals, setGoals] = useState([])
    const [value, setValue] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const [availableCategories, setAvailableCategories] = useState([])
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

    const handleDataChange = (selectedDate) => {
        const [year, month] = selectedDate.split("-");

        const monthName = monthNames[parseInt(month) - 1];

        const budgetExists = budgets.some(
            (budget) =>
            budget.year === parseInt(year) &&
            budget.month === monthName
        );

        if (!budgetExists) {
            setError("No budget exists for the selected month and year.");
            setAvailableCategories([]);
            return;
        }

        setError(null);

        const matchingBudget = budgets.find(
            (budget) =>
            budget.year === parseInt(year) &&
            budget.month === monthName
        );

        setAvailableCategories([
            "Income",
            ...(matchingBudget.categories?.slice().sort((a, b) => a.name.localeCompare(b.name)) || []),
            "Remove from Savings"
        ]);
    };

    useEffect(() => {
        const fetchBudgets = async () => {
            const response = await fetch('https://privatepennybudget-backend.onrender.com/budgets', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
    
            if (response.ok) {
                budgetDispatch({type: 'SET_BUDGETS', payload: json})
            }
        }
    
        if (user) {
            fetchBudgets()
        }
    }, [dispatch, user])

    useEffect(() => {
        const fetchGoals = async () => {
            if (!user) return;

            const response = await fetch('https://privatepennybudget-backend.onrender.com/goals', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                setGoals(json); // Store the fetched goals in state
            } else {
                console.error(json.error || 'Failed to fetch goals.');
            }
        };

        fetchGoals();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in.')
            return
        }

        const transaction = {title, date, category, note, value}

        if (category === "Add to Savings" || category === "Remove from Savings") {
            const goal = goals.find((goal) => goal.name === note);
    
            if (!goal) {
                setError('Goal not found');
                return;
            }
    
            const updatedAmount = category === "Add to Savings"
                ? parseFloat(goal.amountActual) + parseFloat(value)
                : parseFloat(goal.amountActual) - parseFloat(value);
    
            const goalResponse = await fetch(`https://privatepennybudget-backend.onrender.com/goals/${goal._id}`, {
                method: 'PUT',
                body: JSON.stringify({ amountActual: updatedAmount }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });
    
            const goalJson = await goalResponse.json();
    
            if (!goalResponse.ok) {
                setError(goalJson.error);
                return;
            }
    
            const updatedGoals = goals.map((g) =>
                g._id === goal._id ? { ...g, amount: updatedAmount } : g
            );
            setGoals(updatedGoals);
        }

        const response = await fetch('https://privatepennybudget-backend.onrender.com/transactions', {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields || [])
        }

        if (response.ok) {
            setTitle('')
            setDate('')
            setCategory('')
            setNote('')
            setValue('')
            setError(null)
            setEmptyFields([])
            dispatch({type: 'CREATE_EXPENSE', payload: json})
        }
    }

    return (
        <div>
            <h1 className="text-center font-bold text-bodyTextDark">Create a Transaction</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                <input
                    type="date"
                    onChange={(e) => {
                        setDate(e.target.value)
                        handleDataChange(e.target.value)
                    }}
                    value={date}
                    className={`p-px border bg-formInput text-bodyTextDark text-center rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 w-full md:w-auto ${
                        emptyFields.includes('date') ? 'border-warningColor' : 'border-dark1'
                    }`}
                />

                <input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className={`p-px border bg-formInput text-bodyTextDark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 w-full md:w-auto ${
                        emptyFields.includes('title') ? 'border-warningColor' : 'border-dark1'
                    }`}
                />

                <select
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className={`p-px border bg-formInput text-bodyTextDark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 w-full md:w-auto ${
                        emptyFields.includes('category') ? 'border-warningColor' : 'border-dark1'
                    }`}
                >
                    <option value="" disable>Select Category</option>
                    {availableCategories.map((category) => (
                        <option key={category.name || category} value={category.name || category}>
                            {category.name || category}
                        </option>
                    ))}
                </select>

                {(category === "Add to Savings" || category === "Remove from Savings") ? (
                    <select
                        onChange={(e) => setNote(e.target.value)}
                        value={note}
                        className={`p-px border bg-formInput text-bodyTextDark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 ${
                            emptyFields.includes('note') ? 'border-warningColor' : 'border-dark1'
                        }`}
                    >
                        <option value="" disabled>Select Goal</option>
                        {goals.map((goal) => (
                            <option key={goal._id} value={goal.name}>
                                {goal.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        placeholder="Note"
                        onChange={(e) => setNote(e.target.value)}
                        value={note}
                        className={`p-px border bg-formInput text-bodyTextDark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 w-full md:w-auto ${
                            emptyFields.includes('note') ? 'border-warningColor' : 'border-dark1'
                        }`}
                    />
                )}

                <div className="flex items-center">
                    <p className="mr-2">$</p>
                    <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        className={`p-px border bg-formInput text-bodyTextDark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 w-full md:w-auto ${
                            emptyFields.includes('value') ? 'border-warningColor' : 'border-dark1'
                        }`}
                    />
                </div>

                <button className="material-symbols-outlined rounded-md bg-button hover:bg-buttonHover text-bodyTextLight font-bold w-full md:w-auto">
                    add
                </button>

                {error && <div className="text-warningColor">{error}</div>}
            </form>
        </div>
    )
}

export default TransactionForm