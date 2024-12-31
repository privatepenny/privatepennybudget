import { useAuthContext } from "./useAuthContext"
import { useTransactionsContext } from "./useTransactionsContext"

export const useLogout = () => {

    const { dispatch } = useAuthContext()
    const { dispatch: transactionsDispatch } = useTransactionsContext()

    const logout = () => {
        localStorage.removeItem('user')
        dispatch({type: 'LOGOUT'})
        transactionsDispatch({type: 'SET_EXPENSES', payload: null})
    }

    return {logout}
}