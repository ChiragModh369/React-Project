// AuthContext.js
import { createContext, useState, useEffect } from "react";
import { localStorageHelper } from "@/commonFunctions/localStorageHelper";
import { Constants } from "@/Constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginStatus = localStorageHelper.get(Constants.isLogin);
        setIsLoggedIn(loginStatus === true || loginStatus === "true");
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
