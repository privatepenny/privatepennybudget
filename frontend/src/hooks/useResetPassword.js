import { useState } from 'react';

export const useResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);

    const resetPassword = async (token, newPassword) => {
        setIsLoading(true);

        try {
            // const response = await fetch('http://localhost:4001/user/reset-password', {
            const response = await fetch('https://privatepennybudget-backend.onrender.com/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            setIsLoading(false);
            return true; // Success
        } catch (error) {
            setIsLoading(false);
            throw error; // Error
        }
    };

    return { resetPassword, isLoading };
};