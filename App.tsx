
import React, { useState, useEffect } from 'react';
// Fix: Added .tsx extension for explicit module resolution.
import LoginPage from './components/LoginPage.tsx';
// Fix: Added .tsx extension for explicit module resolution.
import RegisterPage from './components/RegisterPage.tsx';
// Fix: Added .tsx extension for explicit module resolution.
import ForgotPasswordPage from './components/ForgotPasswordPage.tsx';
// Fix: Added .tsx extension for explicit module resolution.
import MainLayout from './components/MainLayout.tsx';
// Fix: Added .ts extension for explicit module resolution.
import type { UserData, AuthView } from './types.ts';

const App: React.FC = () => {
    const [users, setUsers] = useState<Record<string, UserData>>({});
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [authView, setAuthView] = useState<AuthView>('login');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem('gpaAppUsers');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            }
            const loggedInUserEmail = sessionStorage.getItem('gpaAppLoggedInUser');
            if (loggedInUserEmail && storedUsers) {
                const allUsers = JSON.parse(storedUsers);
                const user = Object.values(allUsers).find((u: any) => u.profile.email === loggedInUserEmail) as UserData;
                if(user) {
                    setCurrentUser(user);
                }
            }
        } catch (error) {
            console.error("Failed to parse user data from storage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRegister = (newUser: UserData): boolean => {
        if (Object.values(users).some(u => u.profile.email === newUser.profile.email)) {
            alert('Email sudah terdaftar.');
            return false;
        }
        if (Object.values(users).some(u => u.profile.nim === newUser.profile.nim)) {
            alert('NIM sudah terdaftar.');
            return false;
        }

        const updatedUsers = { ...users, [newUser.profile.email]: newUser };
        setUsers(updatedUsers);
        localStorage.setItem('gpaAppUsers', JSON.stringify(updatedUsers));
        setAuthView('login');
        return true;
    };

    const handleLogin = (emailOrNim: string, password: string):boolean => {
        const user = Object.values(users).find(
            u => (u.profile.email === emailOrNim || u.profile.nim === emailOrNim) && u.password === password
        );
        if (user) {
            setCurrentUser(user);
            sessionStorage.setItem('gpaAppLoggedInUser', user.profile.email);
            return true;
        }
        alert('Email/NIM atau password salah.');
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('gpaAppLoggedInUser');
        setAuthView('login');
    };

    const handleSave = (updatedData: UserData) => {
        setCurrentUser(updatedData);
        const updatedUsers = { ...users, [updatedData.profile.email]: updatedData };
        setUsers(updatedUsers);
        localStorage.setItem('gpaAppUsers', JSON.stringify(updatedUsers));
    };
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!currentUser) {
        switch(authView) {
            case 'register':
                return <RegisterPage onRegister={handleRegister} onSwitchView={setAuthView} />;
            case 'forgotPassword':
                return <ForgotPasswordPage onSwitchView={setAuthView} />;
            case 'login':
            default:
                return <LoginPage onLogin={handleLogin} onSwitchView={setAuthView} />;
        }
    }

    return (
        <MainLayout 
            userData={currentUser}
            onSave={handleSave}
            onLogout={handleLogout}
        />
    );
};

export default App;