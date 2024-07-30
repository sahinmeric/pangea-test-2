// src/hooks/creator-use-auth.js

import React, { createContext, useState, useContext } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '../API/creatorTokenUtil';

const CreatorAuthContext = createContext();

export const CreatorAuthProvider = ({ children }) => {
    const [creatorToken, setCreatorToken] = useState(getAuthToken());

    const login = (token) => {
        setAuthToken(token);
        setCreatorToken(token);
    };

    const logout = () => {
        setCreatorToken(null);
        removeAuthToken();
    };

    return (
        
        <CreatorAuthContext.Provider value={{ creatorToken, login, logout }}>
            {children}
        </CreatorAuthContext.Provider>
    );
};

export const useCreatorAuth = () => useContext(CreatorAuthContext);
