import { BudgetContext } from '../context/BudgetContext';
import { useContext } from 'react';

export const useBudgetContext = () => {
    const context = useContext(BudgetContext);

    if (!context) {
        throw Error('useBudgetContext must be used inside a BudgetContextProvider.');
    }

    return context;
};
