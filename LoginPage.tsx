import React, { useState } from 'react';
// Fix: Added .ts extension for explicit module resolution.
import type { AuthView } from '../types.ts';

interface LoginPageProps {
    onLogin: (emailOrNim: string, password: string) => boolean;
    onSwitchView: (view: AuthView) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchView }) => {
    const [emailOrNim, setEmailOrNim] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(emailOrNim, password);
        if (!success) {
            setError('Email/NIM atau password salah. Silakan coba lagi.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Portal Akademik</h1>
                    <p className="text-gray-500">Silakan masuk untuk melanjutkan</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-8">
                    <form onSubmit={handleSubmit}>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailOrNim">
                                Email atau NIM
                            </label>
                            <input
                                className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-unsri-yellow"
                                id="emailOrNim"
                                type="text"
                                placeholder="Masukkan email atau NIM Anda"
                                value={emailOrNim}
                                onChange={(e) => setEmailOrNim(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-unsri-yellow"
                                id="password"
                                type="password"
                                placeholder="******************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-unsri-yellow hover:bg-yellow-500 text-slate-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
                                Masuk
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            Belum punya akun?{' '}
                            <button onClick={() => onSwitchView('register')} className="font-bold text-unsri-yellow hover:text-yellow-400">
                                Daftar di sini
                            </button>
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                             <button onClick={() => onSwitchView('forgotPassword')} className="font-bold text-unsri-yellow hover:text-yellow-400">
                                Lupa Password?
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;