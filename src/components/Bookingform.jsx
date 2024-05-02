

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import AvailableFlights from "./AvailableFlights";
import loadingGif from '../assets/Loading.gif';
import Nightflight from '../assets/Nightsky2.jpg';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from './SearchContext';

function BookingForm() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flightType, setFlightType] = useState("oneway");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableFlights, setAvailableFlights] = useState([]);
  const { updateSearchResults } = useSearchContext();
  const navigate = useNavigate();


  // Auto-complete suggestions
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);

  // Mock data for auto-complete (replace with your actual data)
  const locations = [
    "Mumbai",
    "Delhi",
    "Chennai",
    "Bangalore",
    "Kerala",
    "Madurai"
  ];

  useEffect(() => {
    // Filter auto-complete suggestions based on user input
    const filteredSuggestions = locations.filter((location) =>
      location.toLowerCase().includes(startLocation.toLowerCase())
    );
    setAutoCompleteSuggestions(filteredSuggestions);
  }, [startLocation]);

  const handleStartLocationChange = (event) => {
    setStartLocation(event.target.value);
  };

  const handleEndLocationChange = (event) => {
    setEndLocation(event.target.value);
  }; 
  
  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };




  const handleStartDateChange = (e) => {
    const formattedDate = e.target.value; // This should be in the format "YYYY-MM-DD"
    console.log("Start Date:", formattedDate);
    setStartDate(formattedDate.toLocaleString()); // Corrected function name
  };
  
  const handleEndDateChange = (e) => {
    const formattedDate = e.target.value; // This should be in the format "YYYY-MM-DD"
    console.log("End Date:", formattedDate);
    setEndDate(formattedDate.toLocaleString()); // Corrected function name
  };
  

  //setStartDate(startDate.toLocaleSTring())
  

  const handleToggleFlyDirection = () => {
    const temp = startLocation;
    setStartLocation(endLocation);
    setEndLocation(temp);
  };

  const handleAdultsChange = (value) => {
    const newAdults = adults + value;
    if (newAdults >= 1 && newAdults <= 15) {
      setAdults(newAdults);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const outboundResponse = await fetch("https://successonfly-backend-1.onrender.com/api/check-flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startLocation,
          endLocation,
          startDate,
          endDate,
          flightType,
          adults,
          children,
          infants,
          selectedClass,
        }),
      });

      if (outboundResponse.ok) {
        const outboundResult = await outboundResponse.json();
        const outboundFlights = outboundResult.availableFlights;

        // Fetch return flights if flightType is 'return' and there's a return date
        if (flightType === 'return' && endDate) {
          const returnResponse = await fetch("https://successonfly-backend-1.onrender.com/api/check-flights", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              startLocation: endLocation,
              endLocation: startLocation,
              startDate: endDate,
              endDate: null, // We only need one-way flights for return journey
              flightType: 'oneway',
              adults,
              children,
              infants,
              selectedClass,
            }),
          });

          if (returnResponse.ok) {
            const returnResult = await returnResponse.json();
            const returnFlights = returnResult.availableFlights;

            // Combine outbound and return flights
            const combinedFlights = [...outboundFlights, ...returnFlights];

            updateSearchResults(combinedFlights);
            setAvailableFlights(combinedFlights);
            setSearched(true);
            navigate('/search-results');
          } else {
            console.error("Error fetching return flights");
          }
        } else {
          // Only outbound flights needed
          updateSearchResults(outboundFlights);
          setAvailableFlights(outboundFlights);
          setSearched(true);
          navigate('/search-results');
        }
      } else {
        console.error("Error submitting travel details");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mt-4 p-4 bg-image" style={{ backgroundImage: `url(${Nightflight})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh" }}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <input
                    type="radio"
                    className="btn-check"
                    name="options-base"
                    id="option5"
                    autoComplete="off"
                    checked={flightType === "oneway"}
                    onChange={() => setFlightType("oneway")}
                  />
                  <label className="btn" htmlFor="option5">
                    SingleTrip
                  </label>
                </div>

                <div className="ms-2">
                  <input
                    type="radio"
                    className="btn-check"
                    name="options-base"
                    id="option6"
                    autoComplete="off"
                    checked={flightType === "return"}
                    onChange={() => setFlightType("return")}
                  />
                  <label className="btn" htmlFor="option6">
                    RoundTrip
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col">
              <label className="col mb-3">
                Start Location:
                <input
                  type="text"
                  value={startLocation}
                  onChange={handleStartLocationChange}
                  required
                  className="form-control"
                  autoComplete="off"
                  list="startLocationSuggestions"
                />
                <datalist id="startLocationSuggestions">
                  {autoCompleteSuggestions.map((suggestion, index) => (
                    <option key={index} value={suggestion} />
                  ))}
                </datalist>
              </label>
            </div>

            <div className="col d-flex align-items-center justify-content-center">
              <Button
                variant="link"
                onClick={handleToggleFlyDirection}
                className="fs-2"
              >
                ⇋
              </Button>
            </div>

            <div className="col">
              <label className="col mb-3 ">
                End Location:
                <input
                  type="text"
                  value={endLocation}
                  onChange={handleEndLocationChange}
                  required
                  className="form-control"
                  autoComplete="off"
                  list="endLocationSuggestions"
                />
                <datalist id="endLocationSuggestions">
                  {locations
                    .filter((location) => location !== startLocation)
                    .map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                </datalist>
              </label>
            </div>

            <div className="col">
              <label className=" col mb-3 ">
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  required
                  className="form-control"
                />
              </label>
            </div>

            <div className="col">
              <label className=" mb-4">
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  required
                  className="form-control"
                  disabled={flightType === "oneway"}
                />
              </label>
            </div>
          </div>

          <div className="row mt-4 ">
            <div className="col">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Class
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <div className="col">
                      <label>
                        <select
                          value={selectedClass}
                          onChange={handleClassChange}
                        >
                          <option value="Economy">Economy</option>
                          <option value="PremiumEconomy">Premium Economy</option>
                          <option value="Business">Business</option>
                          <option value="FirstClass">First Class</option>
                        </select>
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col">
              <div className="dropdown">
                <a
                  className="btn btn-secondary dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Guests
                </a>

                <ul className="dropdown-menu">
                  <li className="mx-auto p-3">
                    <label className="dropdown-item">
                      Adults (12 years+):
                      <button onClick={() => handleAdultsChange(-1)}>-</button>
                      <span>{adults}</span>
                      <button onClick={() => handleAdultsChange(1)}>+</button>
                    </label>
                  </li>
                  <li className="mx-auto p-3">
                    <label className="dropdown-item">
                      Children (2-12 years):
                      <button onClick={() => handleChildrenChange(-1)}>-</button>
                      <span>{children}</span>
                      <button onClick={() => handleChildrenChange(1)}>+</button>
                    </label>
                  </li>
                  <li className="mx-auto p-3">
                    <label className="dropdown-item">
                      Infants (0-2 years):
                      <button onClick={() => handleInfantsChange(-1)}>-</button>
                      <span>{infants}</span>
                      <button onClick={() => handleInfantsChange(1)}>+</button>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col d-flex justify-content-center">
              <Button variant="primary" type="submit" className="bg-info fs-5" disabled={loading}>
                {loading ? <img src={loadingGif} alt="Loading" className="loading-icon" /> : "Search"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* {searched && availableFlights.length > 0 && (
        <AvailableFlights 
          availableFlights={availableFlights} 
          startDate={startDate} 
          endDate={endDate} 
        />
      )} */}
      

      
      {searched && availableFlights.length > 0 && (
        <AvailableFlights 
          availableFlights={availableFlights} 
          startDate={startDate} 
          endDate={endDate} 
        />
      )}



      

      {searched && availableFlights.length === 0 && (
        <p>No Flights available for the selected criteria.</p>
      )}
    </div>
  );
}

export default BookingForm;
