import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TransactionsContextProvider } from './context/TransactionContext';
import { AuthContextProvider } from './context/AuthContext';
import { BudgetContextProvider } from './context/BudgetContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BudgetContextProvider>
        <TransactionsContextProvider>
          <App />
        </TransactionsContextProvider>
      </BudgetContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
