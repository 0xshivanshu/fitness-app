// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    // The logout function stays the same
    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    };

    // This function checks storage when the app starts
    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let token = await AsyncStorage.getItem('userToken');
            setUserToken(token);
            setIsLoading(false);
        } catch (e) {
            console.log(`isLoggedIn error ${e}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    // We only need to provide logout, isLoading, and the token itself
    return (
        <AuthContext.Provider value={{ logout, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};