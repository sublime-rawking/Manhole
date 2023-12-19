import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { adminLogin } from '../services/device.Service.js';
import { useNavigate } from "react-router-dom";

const authUserContext = createContext();
export function AuthUserProvider(props) {
    const [admin, setAdmin] = useState(null);

    const navigate = useNavigate();
    // const [error, setError] = useState(null);


    useEffect(() => {
        // Check if the user is already authenticated
        const storedUser = localStorage.getItem("token");

        if (storedUser) {
            setAdmin(JSON.parse(storedUser));
        }
    }, []);



    const logIn = async ({ userName, password }) => {
        const admin = await adminLogin({ userName, password });
        setAdmin(admin ?? null);
        localStorage.setItem("token", JSON.stringify(admin));
        navigate(admin == null ? "/login" : "/");
        return admin ? true : false;
    };
    const logOut = async () => {
        // await signout();
        setAdmin(null);
        navigate("/login");
        localStorage.clear();
    };

    const value = { admin, logIn, logOut, setAdmin };
    return <authUserContext.Provider value={value} {...props} />;
};

const useAuth = () => useContext(authUserContext);
export default useAuth;