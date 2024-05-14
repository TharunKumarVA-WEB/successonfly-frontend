

import React, { useState } from 'react';
import { Card, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import loadingGif from '../assets/Loading.gif';

function AvailableFlights({ availableFlights, isLoggedIn, startDate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleBookFlight = async (flight, className) => {
    setIsLoading(true);
    setError(null);

    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }

    if (!email) {
      alert('Please provide your email.');
      setIsLoading(false);
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
          classSelection: className,
          numAdults: 1,
          numChildren: 0,
          departureDate: startDate,
          userEmail: email,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setBookingMessage(`Your journey was booked successfully! Booking ID: ${result.bookedFlight._id}`);
      } else {
        setError('Error booking flight');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error booking flight');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {bookingMessage && <p>{bookingMessage}</p>}
      <div className="mb-4">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {availableFlights.map((flight) => (
        <div key={flight._id} className="mb-4">
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Remaining Seats</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(flight.class_availability).map(([className, details]) => (
                    <tr key={className}>
                      <td>{className}</td>
                      <td>{details.remaining_seats}</td>
                      <td>{details.price}</td>
                      <td>
                        <Button onClick={() => handleBookFlight(flight, className)}>Book</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      ))}
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={loadingGif} alt="Loading" className="loading-gif" />
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default AvailableFlights;
