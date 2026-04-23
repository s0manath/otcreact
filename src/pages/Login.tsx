import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, LifeBuoy, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await authService.login(username, password);
            if (response.success) {
                navigate('/dashboard');
            } else {
                setError(response.message);
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your connection.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#f8fafc]">
            {/* Artistic Background Blurs */}
            <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-primary-200/40 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/60 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-50/50 rounded-full blur-[100px]" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative z-10">

                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <LifeBuoy className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-black tracking-tighter italic">OTC PORTAL</span>
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-black leading-[1.1] tracking-tight mb-6"
                        >
                            Modernizing Your <br />
                            <span className="text-primary-200">OTC Operations.</span>
                        </motion.h2>
                        <p className="text-primary-100/80 text-lg font-medium leading-relaxed max-w-md">
                            Experience the next generation of ATM management and data handling with high-performance security.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-6">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="text-emerald-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-0.5">Secure Session</p>
                                <p className="text-sm font-bold opacity-80">256-bit AES Encryption Active</p>
                            </div>
                        </div>
                        <p className="text-xs font-medium opacity-40">© 2026 OTC Modernization. Built for performance.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-10 block lg:hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <LifeBuoy className="text-primary-600 w-8 h-8" />
                            <span className="text-xl font-black tracking-tighter text-slate-900 italic uppercase">OTC</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Login</h1>
                        <p className="text-slate-500 font-medium">Please enter your credentials to access the portal.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3"
                        >
                            <AlertCircle className="text-rose-500 w-5 h-5 mt-0.5" />
                            <p className="text-sm font-bold text-rose-600 leading-tight">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all focus:border-primary-400 font-semibold"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all focus:border-primary-400 font-semibold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <label className="relative flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary-500 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                                <span className="ml-3 text-xs font-bold text-slate-500">Remember session</span>
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-600/25 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-xs">Sign In to Account</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-6">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400`}>U{i}</div>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trusted by 500+ bank agents</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
