import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useRegister = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()

    const register = async (email, password, nickname, theme) => {
        setIsLoading(true)
        setError(null)

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
                theme = 'theme-night';
            default:
                theme = 'theme-slate';
        }

        const response = await fetch('https://privatepennybudget-backend.onrender.com/user/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
            navigate('/tutorial')
        }
    }

    return { register, isLoading, error }
}