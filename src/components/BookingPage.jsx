
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BookingPage() {
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [email, setEmail] = useState("");
  const [bookingMessage, setBookingMessage] = useState(''); // State for booking confirmation message
  const navigate = useNavigate();
  const location = useLocation();
  const { flight } = location.state;

  const defaultDepartureDate = new Date().toISOString().split('T')[0];
  const defaultArrivalDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState(defaultDepartureDate);
  const [arrivalDate, setArrivalDate] = useState(defaultArrivalDate);

  
  const handleConfirmBooking = async () => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }
  
    if (!email) {
      alert('Please enter your email.');
      return;
    }
  
    try {
      const response = await fetch('https://successonfly-backend-1.onrender.com/api/book-flight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flight,
          classSelection: selectedClass,
          numAdults,
          numChildren,
          departureDate,
          userEmail: email, // Ensure userEmail is sent correctly
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setBookingMessage(`Booking confirmed! Booking ID: ${result.bookedFlight._id}`);
      } else {
        console.error('Error booking flight:', response.statusText);
        setBookingMessage('Failed to confirm booking. Please try again.');
      }
    } catch (error) {
      console.error('Error booking flight:', error);
      setBookingMessage('Failed to confirm booking. Please try again.');
    }
  };
  





  return (
    <div className="container mt-4">
      {bookingMessage && <div className="alert alert-success">{bookingMessage}</div>}
      <h2 className="mb-4">Booking Details</h2>
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title">{flight.airline}</h3>
          <p className="card-text">Flight Number: {flight.flight_number}</p>
          <p className="card-text">Departure: {flight.departure.location} - {flight.departure.time}</p>
          <p className="card-text">Arrival: {flight.arrival.location} - {flight.arrival.time}</p>
          <p className="card-text">Business Class Seats: {flight.class_availability.Business.remaining_seats}</p>
          <p className="card-text">Economy Class Seats: {flight.class_availability.Economy.remaining_seats}</p>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <label htmlFor="departureDate" className="form-label">Departure Date:</label>
          <input type="date" id="departureDate" className="form-control mb-3" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />

          <label htmlFor="numAdults" className="form-label">Number of Adults:</label>
          <input type="number" id="numAdults" className="form-control mb-3" value={numAdults} min="1" onChange={(e) => setNumAdults(e.target.value)} />
          <label htmlFor="numChildren" className="form-label">Number of Children (below 2 years):</label>
          <input type="number" id="numChildren" className="form-control mb-3" value={numChildren} min="0" onChange={(e) => setNumChildren(e.target.value)} />
          <label htmlFor="class" className="form-label">Select Class:</label>
          <select id="class" className="form-select mb-3" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
          </select>
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" id="email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleConfirmBooking} className="btn btn-primary">Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
