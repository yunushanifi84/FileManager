import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    if (loading) return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-indigo-600 border-b-purple-600 border-l-blue-600 border-r-indigo-300 rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-800 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-indigo-600 border-b-purple-600 border-l-blue-600 border-r-indigo-300 rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-800 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} user={user} />
        <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-4">
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                          <h2 className="text-lg font-bold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Dosya Yükle
                          </h2>
                        </div>
                        <div className="p-6">
                          <FileUpload />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-8">
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
                          <h2 className="text-lg font-bold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Dosyalarım
                          </h2>
                        </div>
                        <div className="p-6">
                          <FileList />
                        </div>
                      </div>
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
                  <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-bold text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Giriş Yap
                        </h2>
                      </div>
                      <div className="p-6">
                        <Login login={login} />
                      </div>
                    </div>
                  </div>
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-bold text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Kayıt Ol
                        </h2>
                      </div>
                      <div className="p-6">
                        <Register login={login} />
                      </div>
                    </div>
                  </div>
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
