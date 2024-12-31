import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Budget from './pages/Budget';
import Transactions from './pages/Transactions';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Tutorial from './pages/Tutorial';

function App() {

  const { user } = useAuthContext()
  const theme = user?.theme || 'theme-slate'

  return (
    <div className={`${theme} flex flex-col min-h-screen`}>
      <BrowserRouter>
        <Navbar />
        <div className='pages flex flex-col items-center flex-grow bg-light1 text-bodyTextDark mt-14 lg:mt-12 h-full'>
          <Routes>
            <Route path='/' element={user ? <Dashboard/> : <Home/>}/>
            <Route path='/forgot-password' element={<ForgotPassword />}/>
            <Route path='/reset-password/:token' element={<ResetPassword />}/>
            <Route path='dashboard' element={user ? <Dashboard/> : <Navigate to='/' />}/>
            <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />}/>
            <Route path='/settings' element={user ? <Settings /> : <Navigate to='/' />}/>
            <Route path='/budget' element={user ? <Budget /> : <Navigate to='/' />}/>
            <Route path='/transactions' element={user ? <Transactions /> : <Navigate to='/' />}/>
            <Route path='/tutorial' element={user? <Tutorial/> : <Home/>} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;