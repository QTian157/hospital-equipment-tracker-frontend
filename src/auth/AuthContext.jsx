import { createContext, useContext, useState } from "react";


// frontend knows the status for login/ logout
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const login = (tokenValue) => {
        localStorage.setItem("token", tokenValue );
        setToken(tokenValue);
    };

    const logout = ()=>{
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: token ? true : false,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
  return useContext(AuthContext);
};