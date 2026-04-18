import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        privacy: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        const errors = { name: '', email: '', password: '', confirmPassword: '', privacy: '' };
        let isValid = true;

        if (!name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        } else if (name.trim().length < 3) {
            errors.name = 'Name must be at least 3 characters';
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            errors.name = 'Name can only contain letters and spaces';
            isValid = false;
        }

        if (!email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            errors.password = 'Password must contain at least one uppercase letter';
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            errors.password = 'Password must contain at least one lowercase letter';
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            errors.password = 'Password must contain at least one number';
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.password = 'Password must contain at least one special character';
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!acceptedPrivacyPolicy) {
            errors.privacy = 'You must accept the Privacy Policy to create an account';
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validate()) {
            return;
        }

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                acceptedPrivacyPolicy: true,
            });

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    const inputClass = (fieldError) =>
        `w-full px-4 py-3 glass-input rounded-xl text-gray-800 placeholder:text-gray-400 ${fieldError ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]' : ''}`;

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="w-full max-w-md glass-modal p-10 rounded-3xl space-y-6 animate-scale-in">
                {/* Brand */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-teal">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Create an Account</h2>
                    <p className="text-gray-500 mt-1 font-medium">Join Heritage Slabs ERP</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100/70 backdrop-blur-sm rounded-xl border border-red-200/50">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 text-sm text-green-700 bg-green-100/70 backdrop-blur-sm rounded-xl border border-green-200/50">
                        {success}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className={inputClass(fieldErrors.name)}
                            placeholder="Kapila Dissanayake"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {fieldErrors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{fieldErrors.name}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            className={inputClass(fieldErrors.email)}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {fieldErrors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`${inputClass(fieldErrors.password)} pr-12`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {fieldErrors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{fieldErrors.password}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Confirm Password</label>
                        <div className="relative group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`${inputClass(fieldErrors.confirmPassword)} pr-12`}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 font-medium">{fieldErrors.confirmPassword}</p>}
                    </div>

                    <div className={`rounded-xl border p-4 ${fieldErrors.privacy ? 'border-red-300 bg-red-50/50' : 'border-white/40 bg-white/30'}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                                checked={acceptedPrivacyPolicy}
                                onChange={(e) => {
                                    setAcceptedPrivacyPolicy(e.target.checked);
                                    if (e.target.checked) {
                                        setFieldErrors((prev) => ({ ...prev, privacy: '' }));
                                    }
                                }}
                            />
                            <span className="text-sm text-gray-700 leading-relaxed">
                                I have read and agree to the{' '}
                                <Link to="/privacy-policy" className="font-bold text-accent hover:text-accent-dark underline underline-offset-2">
                                    Privacy Policy
                                </Link>
                                , including how my details, delivery information, profile photo, and room photos used in
                                the visualizer are handled.
                            </span>
                        </label>
                        {fieldErrors.privacy && <p className="mt-2 text-xs text-red-500 font-medium pl-7">{fieldErrors.privacy}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 btn-accent rounded-xl text-lg mt-2"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-accent hover:text-accent-dark transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}