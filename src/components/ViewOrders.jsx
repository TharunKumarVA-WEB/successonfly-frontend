

import React, { useState, useEffect } from 'react';
import loadingGif from '../assets/Loading.gif';

function ViewOrders({ userEmail }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://successonfly-backend-1.onrender.com/api/get-user-orders?userEmail=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
          console.log("Fetched Orders:", data.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchOrders();
    } else {
      setError('User email is required to fetch orders.');
      setIsLoading(false);
    }
  }, [userEmail]);

  const cancelBooking = async (orderId) => {
    try {
      // Optimistic UI update
      setOrders(orders.filter(order => order._id !== orderId));

      const response = await fetch(`https://successonfly-backend-1.onrender.com/api/cancel-booking/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      console.log('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
      // Optionally, revert the UI change if needed
      setOrders((prevOrders) => [...prevOrders, orders.find(order => order._id === orderId)]);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <img src={loadingGif} alt="Loading" className="loading-gif" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-3">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div key={order._id} className="col-lg-4 col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order</h5>
                  <p className="card-text">Airline: {order.airline}</p>
                  <p className="card-text">Departure Location: {order.departure.location}</p>
                  <p className="card-text">Arrival Location: {order.arrival.location}</p>
                  <p className="card-text">Booking Date: {new Date(order.bookingDate).toLocaleString()}</p>
                  <p className="card-text">Class Selection: {order.classSelection}</p>
                  <p className="card-text">Price: ${order.price}</p>
                  <button className="btn btn-danger" onClick={() => cancelBooking(order._id)}>Cancel Booking</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewOrders;
