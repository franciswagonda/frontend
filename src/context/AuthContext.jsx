
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Ideally verify token with backend here, for now just decode or assume valid if not expired
                    // For MVP, we'll store user info in local storage too or fetch profile
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    setUser(storedUser);
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const login = async (identifier, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { identifier, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    // Admin only: create a new user (student/supervisor)
    const createUser = async (newUserData) => {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/auth/register', newUserData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data; // does not modify current admin session
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, createUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
