import { useState, useEffect } from 'react'
import Goals from "../components/dashboard/Goals"
import PaymentReminders from "../components/dashboard/PaymentReminders"
import Selection from "../components/dashboard/Selection"
import Gallery from '../components/dashboard/Gallery'
import { useAuthContext } from '../hooks/useAuthContext'

const Dashboard = () => {

    const [selectedBudgetId, setSelectedBudgetId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedYear, setSelectedYear] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchBudgets = async () => {
            setIsLoading(true); // Start loading
            try {
                const response = await fetch("/budgets", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const budgetData = await response.json();

                if (response.ok) {
                    setBudgets(budgetData)
                    if (!selectedBudgetId) {
                        const defaultBudget = budgetData.find((budget) => budget.isDefault);
                        if (defaultBudget) {
                            handleSelectionChange(defaultBudget._id, defaultBudget.month, defaultBudget.year);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch default budget:", error);
            } finally {
                setIsLoading(false); // End loading
            }
        };

        if (user) {
            fetchBudgets();
        }
    }, [user, selectedBudgetId]);

    const handleSelectionChange = (budgetId, month, year) => {
        setSelectedBudgetId(budgetId);
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    return (
        <div className='w-full flex flex-col md:flex-row'>
            <div className='w-full md:w-4/12'>
                <Selection
                    onSelectionChange={handleSelectionChange}
                    budgets = {budgets}
                    selectedBudgetId = {selectedBudgetId}
                />
                <hr className="border-t-4 border-dark1 rounded-2xl mx-2 my-4" />
                <PaymentReminders/>
            </div>
            <div className='w-full md:w-5/12 flex justify-center items-center text-bodyTextDark'>
                {isLoading ? (
                        <p>Loading your default budget...</p>
                ) : selectedBudgetId ? (
                    <Gallery selectedBudgetId={selectedBudgetId} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                ) : (
                    <p>Please select a budget to view your reports.</p>
                )}
            </div>
            <div className='w-full md:w-3/12'>
                <Goals/>
            </div>
        </div>
    )
}

export default Dashboard