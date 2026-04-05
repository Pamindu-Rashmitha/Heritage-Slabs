import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/dashboard');
            } else {
                navigate('/catalog');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md glass-modal p-10 rounded-3xl space-y-6 animate-scale-in">
                {/* Brand */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-teal">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Heritage Slabs ERP</h2>
                    <p className="text-gray-500 mt-1 font-medium">Sign in to your account</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100/70 backdrop-blur-sm rounded-xl border border-red-200/50">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 placeholder:text-gray-400"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 placeholder:text-gray-400 pr-12"
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
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 btn-accent rounded-xl text-lg hover:shadow-glow-accent transition-all duration-300"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-accent hover:text-accent-dark transition-colors">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}