import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSignOutAlt, FaSearch } from 'react-icons/fa';
import './AdminDashboard.css';
import AdminSignup from './AdminSignup'; // Import the new AdminSignup component

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    coffeeName: '',
    rate: '',
    photo: null,
  });
  const [currentSection, setCurrentSection] = useState('products');
  const [editProductId, setEditProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data); // Ensure response includes necessary fields
      setCurrentSection('orderHistory');
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch order history. Please try again.');
    }
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Session expired. Please log in again.');
      window.location.href = '/login-admin';
      return;
    }

    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:5000/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);

        const usersResponse = await axios.get('http://localhost:5000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleEdit = (product) => {
    setEditProductId(product._id);
    setFormData({
      coffeeName: product.coffeeName,
      rate: product.rate,
      photo: null,
    });
    setCurrentSection('editProduct');
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(product => product._id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('coffeeName', formData.coffeeName);
    formDataToSend.append('rate', formData.rate);
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    }

    try {
      const response = await axios.post('http://localhost:5000/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product added successfully');
      setProducts([...products, response.data]);
      setFilteredProducts([...products, response.data]);
      setFormData({ coffeeName: '', rate: '', photo: null });
      setCurrentSection('products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('coffeeName', formData.coffeeName);
    formDataToSend.append('rate', formData.rate);
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    }

    try {
      const response = await axios.put(`http://localhost:5000/products/${editProductId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product updated successfully');
      setProducts(products.map(product => product._id === editProductId ? response.data : product));
      setFilteredProducts(products.map(product => product._id === editProductId ? response.data : product));
      setFormData({ coffeeName: '', rate: '', photo: null });
      setEditProductId(null);
      setCurrentSection('products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('User deleted successfully');
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login-admin';
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.coffeeName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const renderSideNav = () => (
    <div className="side-nav">
      <h3>MENU</h3>
      <div className="button-container">
        <button onClick={() => setCurrentSection('addProduct')}>Add New Product</button>
        <button onClick={() => setCurrentSection('products')}>Products</button>
        <button onClick={() => setCurrentSection('users')}>Users</button>
        <button onClick={fetchOrders}>Order History</button> {/* Add this button */}
        <button onClick={() => setCurrentSection('addAdmin')}>Add Admin</button>
      </div>
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
  

  return (
    <div className="admin-dashboard-container">
      {renderSideNav()}
      <div className="main-content">
        <h1>Admin Dashboard</h1>
        {currentSection === 'users' && (
  <div>
    <h2>Users</h2>
    <table className="user-table">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{currentSection === 'orderHistory' && (
  <div>
    <h2>Order History</h2>
    {orders.length > 0 ? (
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Item Name</th>
            <th>Ordered By</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.productName}</td>
              <td>{order.userId?.name || 'N/A'}</td>
              <td>{order.quantity}</td>
              <td>${order.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No orders found.</p>
    )}
  </div>
)}

        {currentSection === 'addProduct' && (
          <form className="add-admin-form" onSubmit={handleSubmit}>
            <div>
              <label>Coffee Name:</label>
              <input
                type="text"
                name="coffeeName"
                value={formData.coffeeName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Image:</label>
              <input type="file" name="photo" onChange={handleFileChange} required />
            </div>
            <button type="submit">Add Product</button>
          </form>
        )}

        {currentSection === 'editProduct' && (
          <form className="add-admin-form" onSubmit={handleEditSubmit}>
            <div>
              <label>Coffee Name:</label>
              <input
                type="text"
                name="coffeeName"
                value={formData.coffeeName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Image:</label>
              <input type="file" name="photo" onChange={handleFileChange} />
            </div>
            <button type="submit">Update Product</button>
          </form>
        )}

        {currentSection === 'addAdmin' && (
          <AdminSignup />
        )}

        {currentSection === 'products' && (
          <div className="product-list">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for a product..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-bar"
              />
              <FaSearch className="search-icon" />
            </div>
            <h2 className="pro">PRODUCTS</h2>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="product-card" key={product._id}>
                  <img
                    src={`http://localhost:5000/uploads/${product.photo}`}
                    alt={product.coffeeName}
                  />
                  <h3>{product.coffeeName}</h3>
                  <p>${product.rate}</p>
                  <button className='edt' onClick={() => handleEdit(product)}>Edit</button>
                  <button className='dlt' onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              ))
            ) : (
              <p className='not-found'>No product found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;