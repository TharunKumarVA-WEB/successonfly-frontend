

import React, { useState, useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import loadingGif from "../assets/Loading.gif";

function DefaultFlights({ loggedIn }) {
  const [availableFlights, setAvailableFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchAllFlights();
  }, []);

  const fetchAllFlights = async () => {
    try {
      const response = await fetch("https://successonfly-backend-1.onrender.com/api/get-all-flights");

      if (response.ok) {
        const data = await response.json();
        setAvailableFlights(data.availableFlights);
      } else {
        console.error("Error fetching flights:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (flight) => {
    window.scrollTo(0, 0);
    // Navigate to the booking page with selected flight details
    navigate("/booking", { state: { flight: flight } }); // Pass the flight data in state
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <img src={loadingGif} alt="Loading" className="loading-gif" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Default Flights</h2>
      {availableFlights.map((flight) => (
        <div key={flight._id} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{flight.airline}</Card.Title>
              <strong>Flight Number:</strong> {flight.flight_number}
              <div className="d-flex justify-content-between mt-2">
                <div className='row'>
                  <p className="card-text">Departure: {flight.departure.time}</p>
                  <p className="card-text">From: {flight.departure.location}</p>
                </div>
                <div className='row'>
                  <p className="card-text">Arrival: {flight.arrival.time}</p>
                  <p className="card-text">To: {flight.arrival.location}</p>
                </div>
              </div>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Remaining Seats</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(flight.class_availability).map(([className, details]) => (
                    <tr key={className}>
                      <td>{className}</td>
                      <td>{details.remaining_seats}</td>
                      <td>{details.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {loggedIn ? (
                <Button variant="primary" onClick={() => handleBookNow(flight)}>Book Now</Button>
              ) : (
                <p>Please login to book</p>
              )}
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default DefaultFlights;
