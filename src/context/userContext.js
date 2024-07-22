import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { adminLogin } from '../services/device.Service.js';
import { useNavigate } from "react-router-dom";

const authUserContext = createContext();

export function AuthUserProvider(props) {
    // If the user is already authenticated, this will be set to the user's credentials
    const [admin, setAdmin] = useState(null);

    const navigate = useNavigate();
    // const [error, setError] = useState(null);


    useEffect(() => {
        // Check if the user is already authenticated
        const storedUser = localStorage.getItem("token");

        if (storedUser) {
            // If the user is already authenticated, set the user's credentials
            setAdmin(JSON.parse(storedUser));
        }
    }, []);



    const logIn = async ({ userName, password }) => {
        // Attempt to log the user in
        const admin = await adminLogin({ userName, password });
        // If the login is successful, set the user's credentials and navigate to the home page
        setAdmin(admin ?? null);
        localStorage.setItem("token", JSON.stringify(admin));
        navigate(admin == null ? "/login" : "/");
        // Return true if the login is successful, false otherwise
        return admin ? true : false;
    };
    const logOut = async () => {
        // Sign the user out
        // await signout();
        // Set the user's credentials to null
        setAdmin(null);
        // Navigate to the login page
        navigate("/login");
        // Clear the user's token from local storage
        localStorage.clear();
    };

    // The value to be passed to the provider
    const value = { admin, logIn, logOut, setAdmin };
    // Return the provider
    return <authUserContext.Provider value={value} {...props} />;
};

const useAuth = () => useContext(authUserContext);
export default useAuth;