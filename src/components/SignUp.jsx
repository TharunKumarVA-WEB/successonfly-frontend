


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingGif from '../assets/Loading.gif';

function RegistrationForm() {
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    name: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      const registerBody = {
        username: registerFormData.username,
        name: registerFormData.name,
        password: registerFormData.password
      };
  
      const response = await fetch('https://successonfly-backend-1.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerBody)
      });
  
      const data = await response.json();
  
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Registration successful.');
        setRegisterFormData({ username: '', name: '', password: '' });
        navigate('/signin');
      } else if (response.status === 409) {
        setErrorMessage('Username already exists. Please sign in.');
      } else {
        setErrorMessage(data.error || 'An error occurred during registration.');
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Please write your email..."
                value={registerFormData.username}
                onChange={(e) => setRegisterFormData({ ...registerFormData, username: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Full name"
                value={registerFormData.name}
                onChange={(e) => setRegisterFormData({ ...registerFormData, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password please.."
                value={registerFormData.password}
                onChange={(e) => setRegisterFormData({ ...registerFormData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          {/* Loading indicator */}
          {loading && (
            <div className="d-flex justify-content-center align-items-center mt-3">
              <img src={loadingGif} alt="Loading" className="loading-gif" />
            </div>
          )}
          {/* Error message */}
          {errorMessage && (
  <div>
    <p className="text-danger mt-3">{errorMessage}</p>
    {errorMessage.includes('Username already exists') && (
      <p className="mt-2">
        Already have an account? 
        <button className="btn btn-link" onClick={() => navigate('/signin')}>Sign In</button>
      </p>
    )}
  </div>
)}
          {/* Success message */}
          {successMessage && <p className="text-success mt-3">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
