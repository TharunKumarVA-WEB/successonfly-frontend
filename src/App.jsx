
//pp.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SignIn from './components/SignIn'; 
import SignUp from './components/SignUp';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import BookingPage from './components/BookingPage';
import FlightsDefault from "./components/DedaultFlights";
import AvailableFlights from "./components/AvailableFlights"; 
import ViewOrders from "./components/ViewOrders"; 
import { SearchProvider } from './components/SearchContext';
import SearchResults from './components/SearchResults';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return JSON.parse(localStorage.getItem('loggedIn')) || false;
  });

  useEffect(() => {
    localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
  }, [loggedIn]);

  const [userEmail, setUserEmail] = useState('');
  const [showAvailableFlights, setShowAvailableFlights] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleLogin = (email) => {
    setUserEmail(email);
    setLoggedIn(true);
  };

  const handleBookNow = () => {
    if (loggedIn) {
      setShowAvailableFlights(false);
    } else {
      return <Navigate to="/signin" />;
    }
  };

  const availableFlights = [];

  return (
    <Router>
      <SearchProvider>
        <div>
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} userEmail={userEmail} />
          <Routes>
            <Route path="/signin" element={<SignIn setLoggedIn={setLoggedIn} setUserEmail={setUserEmail} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<BookingForm handleBookNow={handleBookNow} setStartDate={setStartDate} setEndDate={setEndDate} />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/searchflights" element={<AvailableFlights availableFlights={availableFlights} isLoggedIn={loggedIn} />} />
            <Route path="/search-results" element={<SearchResults startDate={startDate} endDate={endDate} loggedIn={loggedIn} />} />
            <Route path="/orders" element={<ViewOrders userEmail={userEmail} />} />
          </Routes>
          {showAvailableFlights && <FlightsDefault loggedIn={loggedIn}/>}
          <Footer />
        </div>
      </SearchProvider>
    </Router>
  );
}

export default App;
