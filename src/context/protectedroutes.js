import { Navigate } from "react-router-dom";
import useAuth from "./userContext.js";
/**
 * withProtected: This function wraps a component with a protected route.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @param {JSX.Element} Component - The component to be wrapped.
 * @returns {JSX.Element} - The wrapped component.
 */
export function withProtected(Component) {
    return function WithProtected(props) {
        const auth = useAuth();
        // If the user is not authenticated, redirect them to the login page.
        if (!auth.admin) {
            return <Navigate to="/login" replace />
        }
        // If the user is authenticated, render the wrapped component.
        return <Component auth={auth} {...props} />;
    };
}

/**
 * withPublic: This function wraps a component with a public route.
 * If the user is authenticated, it redirects them to the dashboard.
 *
 * @param {JSX.Element} Component - The component to be wrapped.
 * @returns {JSX.Element} - The wrapped component.
 */
export function withPublic(Component) {
    return function WithPublic(props) {
        const auth = useAuth();
        // If the user is authenticated, redirect them to the dashboard.
        if (auth.admin) {
            return <Navigate to="/" replace />
        }
        // If the user is not authenticated, render the wrapped component.
        return <Component auth={auth} {...props} />;
    };
}

