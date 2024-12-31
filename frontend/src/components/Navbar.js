import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Login from '../components/Login'

const Navbar = () => {
    
    const { user } = useAuthContext()

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleToggleMenu = (open) => {
        setIsMenuOpen(open)
    }

    const { logout } = useLogout()
    const handleClick = () => {
        logout()
        handleToggleMenu(false)
    }

    return (
        <header className="bg-dark1 text-bodyTextLight shadow-xl fixed w-full top-0 z-10">
            <div className="container mx-auto flex justify-between items-center py-2 px-6">
                <div className='flex items-center'>
                    <img src="/images/logo.png" alt="saluting soldier logo" style={{ width: '30px', height: '30px' }}/>
                    <Link to="/tutorial" className="text-2xl font-bold text-bodyTextLight hover:text-navbarHover" onClick={() => handleToggleMenu(false)}>
                        Private Penny
                    </Link>
                </div>
                <div className="hidden md:flex md:items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-navbarHover transition-colors duration-200 text-bodyTextLight">
                                Dashboard
                            </Link>
                            <Link to="/budget" className="hover:text-navbarHover transition-colors duration-200 text-bodyTextLight">
                                Budget
                            </Link>
                            <Link to="/transactions" className="hover:text-navbarHover transition-colors duration-200 text-bodyTextLight">
                                Transactions
                            </Link>
                            <Link to="/settings" className="hover:text-navbarHover transition-colors duration-200 text-bodyTextLight">
                                Settings
                            </Link>
                            <button
                                onClick={handleClick}
                                className="bg-button text-bodyTextLight hover:bg-buttonHover font-semibold py-1 px-4 rounded transition-colors duration-200"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Login />
                            <Link to="/register" className="hover:text-navbarHover transition-colors duration-200 text-bodyTextLight">
                                No account? Register!
                            </Link>
                        </>
                    )}
                </div>
                {/* Hamburger Menu */}
                <button 
                    className="md:hidden p-2 rounded focus:outline-none"
                    onClick={() => handleToggleMenu(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <XMarkIcon className="w-6 h-6 text-bodyTextLight" />
                    ) : (
                        <Bars3Icon className="w-6 h-6 text-bodyTextLight" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-dark1">
                    <nav className="flex flex-col space-y-2 py-2">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="block hover:text-navbarHover transition-colors duration-200 text-bodyTextLight text-center" onClick={() => handleToggleMenu(false)}>
                                    Dashboard
                                </Link>
                                <Link to="/transactions" className="block hover:text-navbarHover transition-colors duration-200 text-bodyTextLight text-center" onClick={() => handleToggleMenu(false)}>
                                    Transactions
                                </Link>
                                <Link to="/budget" className="block hover:text-navbarHover transition-colors duration-200 text-bodyTextLight text-center" onClick={() => handleToggleMenu(false)}>
                                    Budget
                                </Link>
                                <Link to="/settings" className="block hover:text-navbarHover transition-colors duration-200 text-bodyTextLight text-center" onClick={() => handleToggleMenu(false)}>
                                    Settings
                                </Link>
                                <button
                                    onClick={handleClick}
                                    className="bg-button text-bodyTextLight hover:bg-buttonHover font-semibold py-1 px-4 rounded transition-colors duration-200"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Login />
                                <Link to="/register" className="block hover:text-navbarHover transition-colors duration-200 text-bodyTextLight text-center">
                                    No account? Register!
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Navbar