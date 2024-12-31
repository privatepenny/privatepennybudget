import { useEffect, useState } from 'react';
import { useBudgetContext } from '../../hooks/useBudgetContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Tooltip, Legend, ArcElement, Title, CategoryScale, ChartDataLabels)

const PieChart = ({ selectedBudgetId }) => {
    const { budgets } = useBudgetContext();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (selectedBudgetId) {
            const selectedBudget = budgets.find(budget => budget._id === selectedBudgetId);
            if (selectedBudget && selectedBudget.categories) {
                setCategories(selectedBudget.categories);
            }
        }
    }, [selectedBudgetId, budgets]);

    const totalAmount = categories.reduce((total, category) => total + category.amount, 0)

    //Data Prep for Chart
    const data = {
        labels: categories.map(category => category.name),
        datasets: [
            {
                label: 'Budget Categories',
                data: categories.map(category => category.amount),
                backgroundColor: categories.map(category => category.color),
                borderWidth: 1,
            },
        ],
    };

    //Tooltip
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const categoryName = context.label;
                        const categoryAmount = context.raw;
                        const categoryPercentage = ((categoryAmount / totalAmount) * 100).toFixed(2);
                        return `${categoryName}: $${categoryAmount} (${categoryPercentage}%)`;
                    },
                },
            },
            legend: {
                display: false,
            },
            datalabels: {
                color: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                font: {
                    weight: 'bold',
                    size: 12,
                },
                formatter: (value, context) => {
                    return `${context.chart.data.labels[context.dataIndex]}: $${value}`;
                },
                align: 'center',
                anchor: 'center',
                display: 'auto'
            },
        },
        responsive: true,
    }

    return (
        <div className="m-2 overflow-y-auto h-[calc(100vh-96px)] w-full">
            <h2 className="text-xl font-bold text-bodyTextDark mb-4 text-center">Budget Categories</h2>
            {categories.length > 0 ? (
                <div className='p-2'>
                    <div className='w-4/5 h-[300px] mx-auto'>
                        <Pie data={data} options={options} className='mx-auto'/>
                    </div>
                    <ul className="list-none mt-4">
                        {categories.map((category, index) => (
                            <li key={category.name} className="mb-2 flex justify-between text-sm text-bodyTextDark">
                                <div
                                    className="w-4 h-4 mr-2 rounded-md"
                                    style={{ backgroundColor: category.color }}
                                ></div>
                                <span className="font-semibold">{category.name}</span>
                                <span>${category.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No categories found for this budget.</p>
            )}
        </div>
    );
};

export default PieChart;