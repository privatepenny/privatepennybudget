import { createContext, useReducer } from 'react'

export const TransactionsContext = createContext()

export const transactionsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EXPENSES':
            return {
                transactions: action.payload
            }
        case 'CREATE_EXPENSE':
            return {
                transactions: [action.payload, ...state.transactions]
            }
        case 'DELETE_EXPENSE':
            return {
                transactions: state.transactions.filter((transaction) => transaction._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const TransactionsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(transactionsReducer, {
        transactions: null
    })


    return (
        <TransactionsContext.Provider value={{...state, dispatch}}>
            { children }
        </TransactionsContext.Provider>
    )
}