import '../../index.css'
import { useState, useEffect } from "react"
import { useTransactionsContext } from '../../hooks/useTransactionsContext'
import { useBudgetContext } from '../../hooks/useBudgetContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const BatchTransactionForm = () => {
    const { dispatch } = useTransactionsContext()
    const { budgets, dispatch: budgetDispatch } = useBudgetContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [category, setCategory] = useState('')
    const [note, setNote] = useState('')
    const [goals, setGoals] = useState([])  // Define goals state
    const [value, setValue] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const [availableCategories, setAvailableCategories] = useState([])

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const handleDataChange = (selectedDate) => {
        const [year, month] = selectedDate.split("-")
        const monthName = monthNames[parseInt(month) - 1]

        const budgetExists = budgets.some(
            (budget) =>
                budget.year === parseInt(year) &&
                budget.month === monthName
        )

        if (!budgetExists) {
            setError("No budget exists for the selected month and year.")
            setAvailableCategories([])
            return
        }

        setError(null)

        const matchingBudget = budgets.find(
            (budget) =>
                budget.year === parseInt(year) &&
                budget.month === monthName
        )

        const availableCategoriesList = [
            "Income",
            ...(matchingBudget.categories
                ? matchingBudget.categories
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => category.name)
                : []),
            "Remove from Savings"
        ]

        setAvailableCategories(availableCategoriesList)
    }

    useEffect(() => {
        const fetchBudgets = async () => {
            const response = await fetch('https://privatepennybudget-backend.onrender.com/budgets', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                budgetDispatch({ type: 'SET_BUDGETS', payload: json })
            }
        }

        if (user) {
            fetchBudgets()
        }
    }, [dispatch, user])

    useEffect(() => {
        const fetchGoals = async () => {
            if (!user) return

            const response = await fetch('https://privatepennybudget-backend.onrender.com/goals', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            })

            const json = await response.json()
            if (response.ok) {
                setGoals(json)  // Store the fetched goals in state
            } else {
                console.error(json.error || 'Failed to fetch goals.')
            }
        }

        fetchGoals()
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in.')
            return
        }

        // Check if the category is valid for the selected month/year
        if (!availableCategories.includes(category)) {
            setError("The selected category does not exist for the selected month/year.")
            return
        }

        const transaction = { title, date, category, note, value }

        if (category === "Add to Savings" || category === "Remove from Savings") {
            const goal = goals.find((goal) => goal.name === note)

            if (!goal) {
                setError('Goal not found')
                return
            }

            const updatedAmount = category === "Add to Savings"
                ? parseFloat(goal.amountActual) + parseFloat(value)
                : parseFloat(goal.amountActual) - parseFloat(value)

            const goalResponse = await fetch(`/goals/${goal._id}`, {
                method: 'PUT',
                body: JSON.stringify({ amountActual: updatedAmount }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            })

            const goalJson = await goalResponse.json()

            if (!goalResponse.ok) {
                setError(goalJson.error)
                return
            }

            const updatedGoals = goals.map((g) =>
                g._id === goal._id ? { ...g, amountActual: updatedAmount } : g
            )
            setGoals(updatedGoals)
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
            dispatch({ type: 'CREATE_EXPENSE', payload: json })
        }
    }

    return (
        <div>
            <h1 className="text-center font-bold text-bodyTextDark">Create a Transaction</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                <textarea
                    placeholder="Enter transaction data (CSV format: title, category, note, value)"
                    onChange={(e) => {
                        const [d, t, c, n, v] = e.target.value.split(',').map(item => item.trim());
                        setDate(d || '');
                        setTitle(t || '');
                        setCategory(c || '');
                        setNote(n || '');
                        setValue(v || '');
                        if (d) {
                            const [year, month] = d.split('-');  // Split the date to get year and month
                            const formattedDate = `${year}-${month}`;  // Create the YYYY-MM format
                            handleDataChange(formattedDate);  // Pass this to handleDataChange
                        }
                    }}
                    value={`${date}, ${title}, ${category}, ${note}, ${value}`}
                    className={`p-px border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 w-full md:w-auto ${
                        emptyFields.includes('title') ? 'border-warningColor' : 'border-light3'
                    }`}
                />

                <button className="material-symbols-outlined border border-dark1 rounded-md bg-dark1 text-light1 font-bold w-full md:w-auto">
                    add
                </button>

                {error && <div className="text-warningColor">{error}</div>}
            </form>
        </div>
    )
}

export default BatchTransactionForm