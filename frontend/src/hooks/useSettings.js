import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSettings = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const { dispatch } = useAuthContext()

    const settings = async (email, password, nickname, theme) => {
        setIsLoading(true)
        setError(null)
        setSuccessMessage('')

        switch (theme) {
            case 'Parchment':
                theme = 'theme-parchment';
                break;
            case 'Ocean':
                theme = 'theme-ocean';
                break;
            case 'Forest':
                theme= 'theme-forest';
                break;
            case 'Bouquet':
                theme = 'theme-bouquet';
                break;
            case 'Slate':
                theme = 'theme-slate';
                break;
            case 'Night':
                theme = 'theme-night'
            default:
                break;
        }

        const user = JSON.parse(localStorage.getItem('user'))
        const token = user ? user.token : null;

        const response = await fetch('http://localhost:4001/user/settings', {
        // const response = await fetch('https://privatepennybudgettest-backend.onrender.com/user/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({email, password, nickname, theme})
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
            setSuccessMessage('✅✅✅ Account settings updated successfully! ✅✅✅')
        }
    }

    const deleteAccount = async (password) => {
        setIsLoading(true)
        setError(null)
        setSuccessMessage('')

        const user = JSON.parse(localStorage.getItem('user'))
        const token = user ? user.token : null;

        const response = await fetch('http://localhost:4001/user/delete', {
        // const response = await fetch('https://privatepennybudgettest-backend.onrender.com/user/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            localStorage.removeItem('user')
            dispatch({ type: 'LOGOUT' })
            setIsLoading(false)
            setSuccessMessage('Account deleted successfully.')
        }
    }

    return { settings, deleteAccount, isLoading, error, successMessage }
}