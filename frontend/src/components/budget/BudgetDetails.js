import React, { useState } from 'react';

const BudgetDetails = ({ budget }) => {
    const [formData, setFormData] = useState({
        month: budget.month,
        year: budget.year,
        budgetedIncome: budget.budgetedIncome || 0,
        categories: budget.categories,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

    // Handle input changes for month and year
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle category updates
    const handleCategoryChange = (index, field, value) => {
        const updatedCategories = formData.categories.map((category, i) =>
            i === index ? { ...category, [field]: value } : category
        );
        setFormData((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    // Add a new category
    const addCategory = () => {
        setFormData((prev) => ({
            ...prev,
            categories: [...prev.categories, { name: '', amount: '' }],
        }));
    };

    // Remove a category
    const removeCategory = (index) => {
        const updatedCategories = formData.categories.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    // Show the modal for editing a category's note
    const handleEditNoteClick = (index) => {
        setSelectedCategoryIndex(index);
        setModalVisible(true);
    };

    // Close the modal
    const closeModal = () => {
        setModalVisible(false);
        setSelectedCategoryIndex(null);
    };

    // Calculate total planned expenses
    const plannedExpenses = formData.categories.reduce((sum, category)=> {
        const amount = parseFloat(category.amount) || 0
        return sum + amount
    }, 0);

    // Submit the updated budget to the server
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const token = user ? user.token : null;
            if (!token) throw new Error('Authorization token not found. Please log in.');

            const response = await fetch(`http://localhost:4001/budgets/${budget._id}`, {
            // const response = await fetch(`https://privatepennybudgettest-backend.onrender.com/budgets/${budget._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(await response.json().then((res) => res.error));
            }

            const updatedBudget = await response.json();
            alert('Budget updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-6 overflow-y-auto h-[calc(100vh-80px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                    <div className="flex justify-center space-x-2 font-bold text-bodyTextDark">
                        <select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            className="text-2xl text-center font-bold bg-transparent border-none focus:outline-none appearance-none"
                        >
                            {[
                                'January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'
                            ].map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="text-2xl font-bold bg-transparent border-none w-24 text-center focus:outline-none"
                        />
                    </div>
                </div>

                <hr className='border-t-2 border-dark1 mt-2'/>

                <div className="flex items-center justify-between space-x-4">
                    <div className="w-full sm:w-1/2">
                        <h3 className="text-lg font-semibold text-bodyTextDark">Budgeted Income:</h3>
                        <input
                            type="number"
                            name="budgetedIncome"
                            value={formData.budgetedIncome}
                            onChange={handleChange}
                            placeholder="Enter budgeted income"
                            className="mt-1 block w-full p-2 border border-dark1 bg-formInput text-bodyTextDark text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1"
                        />
                    </div>
                    <div className="w-full sm:w-1/2 sm:mt-0">
                        <h3 className="text-lg font-semibold text-bodyTextDark">Planned Expenses:</h3>
                        <p className="text-sm text-bodyTextDark bg-formInputDenied p-2 rounded-md border border-dark1">${plannedExpenses.toFixed(2)}</p>
                    </div>
                    <div className="w-full sm:w-1/2 sm:mt-0">
                        <h3 className="text-lg font-semibold text-bodyTextDark">Remaining Income:</h3>
                        <p className={`text-sm text-bodyTextDark p-2 rounded-md border border-dark1 ${formData.budgetedIncome - plannedExpenses < 0 ? 'bg-warningColor': 'bg-formInputDenied'}`}>${(formData.budgetedIncome-plannedExpenses).toFixed(2)}</p>
                    </div>
                </div>

                <hr className='border-t-2 border-dark1 mt-2'/>

                <div>
                    <h3 className="text-lg font-semibold text-bodyTextDark">Categories and Amounts:</h3>
                    {formData.categories.map((category, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="color"
                                    value={category.color}
                                    onChange={(e) => handleCategoryChange(index, 'color', e.target.value)}
                                    className="h-8 w-8 cursor-pointer p-0 rounded-md bg-light1"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleEditNoteClick(index)}
                                className={`mt-2 sm:mt-0 sm:ml-4 text-dark1 hover:text-dark3sm:self-center material-symbols-outlined hover:text-dark2`}
                            >
                                edit_square
                            </button>

                            <div className="w-full sm:w-1/2">
                                <input
                                    type="text"
                                    value={category.name}
                                    onChange={(e) => 
                                        category.name === 'Add to Savings' ? null :
                                        handleCategoryChange(index, 'name', e.target.value)}
                                    placeholder="Name"
                                    className={`text-bodyTextDark mt-1 block w-full text-sm p-2 border border-dark1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 ${category.name === 'Add to Savings' ? 'bg-formInputDenied focus:ring-0' : ''}`}
                                />
                            </div>

                            <div className="w-full sm:w-1/2">
                                <input
                                    type="number"
                                    value={category.amount}
                                    onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                                    placeholder="Amount"
                                    className="text-bodyTextDark mt-1 block w-full text-sm p-2 border border-dark1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeCategory(index)}
                                className={`mt-2 sm:mt-0 sm:ml-4 sm:self-center material-symbols-outlined ${category.name === 'Add to Savings' ? 'text-light1' : 'text-dark1'} ${category.name === 'Add to Savings' ? 'hover:text-light1' : 'hover:text-warningColor'}`}
                                disabled={category.name === 'Add to Savings'}
                            >
                                delete
                            </button>
                        </div>
                    ))}
                </div>

                <hr className='border-t-2 border-dark1 mt-2'/>

                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:items-center">
                    <button
                        type="button"
                        onClick={addCategory}
                        className="w-full py-1 bg-button text-bodyTextLight rounded-lg hover:bg-buttonHover"
                    >
                        Add Category
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-1 text-bodyTextLight rounded-lg ${loading ? 'bg-gray-500' : 'bg-button hover:bg-buttonHover'}`}
                    >
                        {loading ? 'Updating...' : 'Update Budget'}
                    </button>
                </div>

                {error && <p className="text-warningColor text-xl text-center">{error}</p>}
            </form>

            {modalVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-bodyTextDark">{formData.categories[selectedCategoryIndex]?.name || ''} Notes</h2>
                        <textarea
                            value={formData.categories[selectedCategoryIndex]?.note || ''}
                            onChange={(e) => handleCategoryChange(selectedCategoryIndex, 'note', e.target.value)}
                            className="mt-1 block w-full text-sm p-2 border border-dark1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1 h-56 text-bodyTextDark"
                        />
                        <button onClick={closeModal} className="mt-2 bg-button hover:bg-buttonHover text-bodyTextLight rounded-lg w-full">
                            Close
                        </button>
                        <p className='text-center text-bodyTextDark'>Don't forget to update your budget!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetDetails;