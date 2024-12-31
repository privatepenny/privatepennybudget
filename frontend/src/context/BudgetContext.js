import { createContext, useReducer } from 'react';

export const BudgetContext = createContext();

export const budgetReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BUDGETS':
            return { budgets: action.payload };
        case 'CREATE_BUDGET':
            return { budgets: [action.payload, ...state.budgets] };
        case 'DELETE_BUDGET':
            return { budgets: state.budgets.filter(budget => budget._id !== action.payload._id) };
        case 'SET_DEFAULT_BUDGET':
            return {
                ...state,
                budgets: state.budgets.map((budget) =>
                    budget._id === action.payload._id
                        ? { ...budget, isDefault: true }
                        : { ...budget, isDefault: false }
                ),
            };
        default:
            return state;
    }
};

export const BudgetContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(budgetReducer, { budgets: [] });

    return (
        <BudgetContext.Provider value={{ ...state, dispatch }}>
            {children}
        </BudgetContext.Provider>
    );
};