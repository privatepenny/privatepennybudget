import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://privatepennybudget-backend.onrender.com/user/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setMessage('A reset link has been sent to your email.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleForgotPassword} className="mt-12 flex flex-col space-y-4">
            <label className="block text-bodyTextDark mb-2">We will send you a reset link to your email.</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="bg-formInput border border-dark1 px-2 text-bodyTextDark rounded-md focus:ring-2"
            />
            <button
                type="submit"
                className="bg-button px-2 text-bodyTextLight rounded-md font-semibold transition-colors duration-200 hover:bg-buttonHover focus:outline-none"
            >
                Send Reset Link
            </button>
            {message && <div className="text-warningColor">{message}</div>}
            {error && <div className="text-warningColor">{error}</div>}
        </form>
    );
};

export default ForgotPassword;