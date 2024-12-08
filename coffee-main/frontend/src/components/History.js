import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css' ;
function History() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Error fetching orders. Please try again later.');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order History</h1>
      <div className="order-list">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th> {/* Added new column */}
              <th>Item Name</th>
              <th>Ordered By</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td> {/* Render the Order ID */}
                <td>{order.productName}</td>
                <td>{order.userName}</td>
                <td>{order.quantity}</td>
                <td>${order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
