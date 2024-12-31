import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // For handling navigation and URL parameters
import { useResetPassword } from '../hooks/useResetPassword'; // Custom hook to handle the password reset logic

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { token } = useParams(); // Getting the token from the URL
    const navigate = useNavigate();

    const { resetPassword, isLoading } = useResetPassword();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const success = await resetPassword(token, password);
            if (success) {
                setSuccessMessage('Your password has been successfully reset!');
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (err) {
            setError('There was an error resetting your password.');
        }
    };

    return (
        <div className="w-full p-6">
            <h3 className="text-xl font-bold text-bodyTextDark text-center">Reset Password</h3>
            <p className="text-sm text-bodyTextDark mb-4 text-center">Enter your new password below:</p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
                <div className="mb-4">
                    <label className="block text-bodyTextDark mb-2">New Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="w-full p-2 border border-dark1 rounded-md mb-4 bg-formInput"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-bodyTextDark mb-2">Confirm Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        className="w-full p-2 border border-dark1 rounded-md bg-formInput"
                        required
                    />
                </div>

                <button 
                    disabled={isLoading} 
                    type="submit"
                    className="w-full mt-4 bg-button hover:bg-buttonHover text-bodyTextLight p-2 rounded-md"
                >
                    Reset Password
                </button>
            </form>

            {error && <div className="bg-dark1 text-bodyTextLight text-center rounded-md p-4 mt-4">{error}</div>}
            {successMessage && <div className="bg-dark1 text-bodyTextLight text-center rounded-md p-4 mt-4">{successMessage}</div>}
        </div>
    );
};

export default ResetPassword;
