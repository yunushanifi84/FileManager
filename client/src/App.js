import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Bileşenler
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde token kontrolü
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Korumalı route
  const PrivateRoute = ({ children }) => {
    if (loading) return <div className="text-center mt-5">Yükleniyor...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} user={user} />
        <div className="container mt-4">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="row">
                    <div className="col-md-4">
                      <FileUpload />
                    </div>
                    <div className="col-md-8">
                      <FileList />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login login={login} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Register login={login} />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
