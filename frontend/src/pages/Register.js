import { useState } from 'react'
import { useRegister } from '../hooks/useRegister'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [theme, setTheme] = useState('')
    const {register, error, isLoading} = useRegister()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        await register(email, password, nickname, theme)
    }

    return (
        <div className="bg-light1 flex h-full justify-center items-center w-[1000px]">
            <form onSubmit={handleSubmit} className="w-full max-w-3xl p-6 rounded-lg">
                <h3 className="text-3xl font-bold mb-4 text-bodyTextDark">Register</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-bodyTextDark mb-2">Email:</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-formInput"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-bodyTextDark mb-2">Nickname:</label>
                        <input
                            type="text"
                            onChange={(e) => setNickname(e.target.value)}
                            value={nickname}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-formInput"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-bodyTextDark mb-2">Password:</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-formInput"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-bodyTextDark mb-2">Confirm Password:</label>
                        <input
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            className="w-full p-2 border border-gray-300 rounded-md bg-formInput"
                            required
                        />
                    </div>
                </div>

                <label className="block text-bodyTextDark mb-2">Color Theme:</label>
                <select
                    onChange={(e) => setTheme(e.target.value)}
                    value={theme}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-formInput"
                    required
                >
                    <option value="Slate" selected>Slate</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Forest">Forest</option>
                    <option value="Bouquet">Bouquet</option>
                    <option value="Parchment">Parchment</option>
                    <option value="Night">Night</option>
                </select>

                <button disabled={isLoading} className="w-full mt-4 bg-button hover:bg-buttonHover text-bodyTextLight p-2 rounded-md">Register</button>
                

                {error && <div className="bg-dark1 text-bodyTextLight text-center rounded-md p-4 mt-4">❌❌❌ {error} ❌❌❌</div>}
            </form>
        </div>
    )
}

export default Register