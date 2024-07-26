import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/Sidebar';                         // importing SideBar
import sidebar_menu from './constants/sidebar-menu';                // importing sidebar_menu
import Login from './components/Login/login';                       // importing Login
import { AuthUserProvider } from "./context/userContext.js"         // importing AuthUserProvider for user authentication
import './App.css';


// importing lazy pages here
const MapView = lazy(() => import('./pages/MapView'));
const Device = lazy(() => import('./pages/Device'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Configure = lazy(() => import('./pages/Configure'));

/**
 * Main application component.
 * Handles routing and authentication context.
 */
const App = () => {

  /**
   * Render the side bar and the main content of the dashboard page.
   * @param {string} path - The path of the route.
   * @param {React.ReactNode} element - The element to render.
   * @returns {JSX.Element} The route element.
   */
  const renderRoute = (element) => (
    <div className='dashboard-body'>
      <div className='dashboard-container'>
        <SideBar menu={sidebar_menu} />
        {element}
      </div>
    </div>
  );

  return (
    <Router>
      <AuthUserProvider>

        <Suspense fallback={<div>Loading...</div>}>
          <Routes >
            <Route exact path="/login" element={<Login />} />

            <Route exact path="/" element={renderRoute(<Dashboard />)} />
            <Route exact path="/devices" element={renderRoute(<Device />)} />
            <Route exact path="/mapView" element={renderRoute(<MapView />)} />
            <Route exact path="/configure" element={renderRoute(<Configure />)} />

          </Routes>
        </Suspense>
      </AuthUserProvider>
    </Router>
  )
}

export default App;