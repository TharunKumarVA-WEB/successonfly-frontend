

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadingGif from '../assets/Loading.gif'; // Import your loading gif

function SignIn({ setLoggedIn, setUserEmail }) {
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {

 

    e.preventDefault();

    try {
      setLoading(true);
      console.log('Logging in user...');

      // Simulating login, replace this with actual login logic
      // For localhost with port 3000
      const response = await fetch('https://successonfly-backend-1.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginFormData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful.');
        setLoggedIn(true);
        setUserEmail(loginFormData.username);
        navigate('/');
      } else {
        console.log('Error logging in:', data.error || 'Unknown error');
        setErrorMessage(data.error || 'An error occurred during login.');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email..."
              value={loginFormData.username}
              onChange={(e) => setLoginFormData({ ...loginFormData, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password..."
              value={loginFormData.password}
              onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {/* Loading gif */}
          {loading && (
            <div className="d-flex justify-content-center align-items-center mt-3">
              <img src={loadingGif} alt="Loading" className="loading-gif" />
            </div>
          )}
          {/* Add Link to Signup page */}
          <p className="mt-3">Don't have an account? <Link to="/signup">Signup</Link></p>
        </form>
        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  setUserEmail: PropTypes.func.isRequired
};

export default SignIn;

