import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import legaldad from '../../legaldad.png';
import './login.css'; // Import custom CSS

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                setErrorMessage(error.code);
                switch (error.code) {
                    case 'auth/invalid-credential':
                        setErrorMessage('Invalid email or password');
                        break;
                    case 'auth/user-disabled':
                        setErrorMessage('User account is disabled');
                        break;
                    default:
                        setErrorMessage('Failed to sign in. Please try again.');
                }
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch((err) => {
                setIsSigningIn(false);
            });
        }
    };

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <main className="main-container">
                <div className="login-box">
                    <div className="flex justify-center mb-4">
                        <img src={legaldad} alt="Logo" className='login-logo' />
                    </div>
                    <div className="text-center mb-6">
                        <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Welcome Back</h3>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-gray-600 font-bold">Email </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-700 bg-gray-100 outline-none transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 font-bold">Password </label>
                            <input
                                type="password"
                                autoComplete='current-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-700 bg-gray-100 outline-none transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='error-message'>{errorMessage}</span>
                        )}
                        <br></br>
                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`w-full px-4 py-2 font-medium rounded-lg ${isSigningIn ? 'bg-gray-400 cursor-not-allowed text-black' : 'bg-indigo-600 text-black hover:text-white hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account? <Link to={'/register'} className="hover:underline font-bold text-indigo-500">Sign up</Link>
                    </p>
                    <div className='or-divider'>
                        <div></div>
                        <span>OR</span>
                        <div></div>
                    </div>
                    <button
                        disabled={isSigningIn}
                        onClick={onGoogleSignIn}
                        className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium text-gray-700 ${isSigningIn ? 'cursor-not-allowed' : 'hover:bg-gray-100 transition duration-300 active:bg-gray-200'}`}
                    >
                        
                        Sign In with Google
                    </button>
                </div>
            </main>
        </>
    );
};

export default Login;
