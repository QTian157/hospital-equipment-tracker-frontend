import { createContext, useContext, useState } from "react";


// frontend knows the status for login/ logout
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [username, setUsername] = useState(
        localStorage.getItem("username")
    );

    const login = (tokenValue, username) => {
        localStorage.setItem("token", tokenValue );
        localStorage.setItem("username", username);
        setToken(tokenValue);
        setUsername(username);
        
    };

    const logout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        setToken(null);
        setUsername(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: token ? true : false,
                login,
                logout,
                username,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
  return useContext(AuthContext);
};