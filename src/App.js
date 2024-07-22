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

const App = () => {

  return (
    <Router>
      <AuthUserProvider>

        <Suspense fallback={<div>Loading...</div>}>
          <Routes >
            <Route exact path="/login" element={<Login />} />

            <Route exact path="/" element={
              <div className='dashboard-body'>
                <div className='dashboard-container'>
                  <SideBar menu={sidebar_menu} />
                  <Dashboard />
                </div>
              </div>
            } />
            <Route exact path="/devices" element={
              <div className='dashboard-body'>
                <div className='dashboard-container'>
                  <SideBar menu={sidebar_menu} />
                  <Device />
                </div>
              </div>
            } />
            <Route exact path="/mapView" element={
              <div className='dashboard-body'>
                <div className='dashboard-container'>
                  <SideBar menu={sidebar_menu} />
                  <MapView />
                </div>
              </div>
            } />
            <Route exact path="/configure" element={
              <div className='dashboard-body'>
                <div className='dashboard-container'>
                  <SideBar menu={sidebar_menu} />
                  <Configure />
                </div>
              </div>
            } />

          </Routes>
        </Suspense>
      </AuthUserProvider>
    </Router>
  )
}

export default App;