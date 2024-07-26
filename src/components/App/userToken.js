import { useState } from 'react';

/**
 * Custom hook to manage user token.
 *
 * @return {Object} Object containing setToken function and token state.
 */
export default function useToken() {
    // Get token from sessionStorage
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token;
    };

    // Initialize token state with token from sessionStorage
    const [token, setToken] = useState(() => getToken());

    // Save token to sessionStorage and update token state
    const saveToken = (userToken) => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    // Return setToken function and token state
    return {
        setToken: saveToken,
        token,
    };
}
