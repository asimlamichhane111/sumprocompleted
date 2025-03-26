import React, { createContext, useState, useEffect, useContext } from "react";


export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const[isAuthenticated,setIsAuthenticated]=useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token) {
            setUser({ token, role });
            setIsAuthenticated(!!token);

        }
        setLoading(false);
    }, []);


    const login = (token,role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setUser({ token, role });
        setIsAuthenticated(true);
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout ,isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};
