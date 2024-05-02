import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className="bg-dark text-light py-1 mt-2  w-100">
      <div className="container mt-2 ">
        <div className="row">
          <div className="col">
            <h5>watch with</h5>
            <p>www.sucessonfly.com</p>
            
          </div>
          <div className="col">
            <h5>connect</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-light"><p>Email: sucessonfly.com</p></a>
              </li>
             
              
            </ul>
          </div>
          <div className="col">
            <h5>contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/Facebook" className="text-light"><p>Phone: +91-7305751374</p></a>
              </li>
             
              
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
