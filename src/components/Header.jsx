

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Header({ loggedIn, setLoggedIn, userEmail }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here
    // For example, clear localStorage, reset state, etc.
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <div className='container'>
      <div className='row mx-auto p-3'>
        <div className='col auto'>
          <h3>successonfly✈️</h3>
        </div>

   
        
        

        {loggedIn ? (
          <div className='col-1 auto text-right'>
            <div className="dropdown-center">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {userEmail} {/* Display user's email directly */}
                </button>
              <ul className="dropdown-menu">
                <li><Link to="/orders" className="dropdown-item">View Orders</Link></li>
                <li><a className="dropdown-item" onClick={handleLogout} href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        ) : (
          <div className='col-1 auto text-right'>
            <div className="dropdown-center">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                My Account
              </button>
              <ul className="dropdown-menu">
                <li><Link to="/signin" className={`dropdown-item ${location.pathname === '/signin' && 'active'}`}>SignIn</Link></li>
                <li><Link to="/signup" className={`dropdown-item ${location.pathname === '/signup' && 'active'}`}>SignUp</Link></li>
              </ul>
            </div>
          </div>
        )}
        
        
        

    

      </div>
    </div>
  );
}

export default Header;
