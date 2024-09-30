import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import legaldad from '../../legaldad.png';
import './register.css'; // Import the CSS file

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { userLoggedIn } = useAuth();

    const validatePassword = (password) => {
        const minLength = 6;
        const alphanumerical = /^(?=.*[A-Za-z])(?=.*\d)/;
        const specialCharacter = /[@$!%*#?&]/;

        if (password.length < minLength) {
            return 'Password must be at least 6 characters long';
        }
        if (!alphanumerical.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!specialCharacter.test(password)) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrorMessage(passwordError);
            return;
        }

        if (!isRegistering) {
            setIsRegistering(true);
            try {
                await doCreateUserWithEmailAndPassword(email, password);
                navigate('/'); // Redirect to home after successful registration
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('Email is already in use');
                } else {
                    setErrorMessage('Failed to create an account. Please try again.');
                }
                setIsRegistering(false);
            }
        }
    };

    return (
        <>
            {userLoggedIn && <Navigate to="/" replace={true} />}

            <main className="flex items-center justify-center w-full h-screen bg-gray-100">
                <div className="register-container">
                    <div className="flex justify-center mb-4">
                        <img src={legaldad} alt="Logo" className='h-20' />
                    </div>

                    <h3 className="register-heading">
                        Create a New Account
                    </h3>

                    <form onSubmit={onSubmit} className="register-form">
                        <div>
                            <label className="register-label">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="register-input"
                            />
                        </div>

                        <div>
                            <label className="register-label">
                                Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="register-input"
                            />
                        </div>

                        <div>
                            <label className="register-label">
                                Confirm Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="register-input"
                            />
                        </div>

                        {errorMessage && (
                            <span className='register-error'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`register-button ${isRegistering ? 'disabled' : ''}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>

                        {!userLoggedIn && (
                            <div className="register-footer">
                                Already have an account? {' '}
                                <Link to={'/'} className="register-link">Continue</Link>
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;
