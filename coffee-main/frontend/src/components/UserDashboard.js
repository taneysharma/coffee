import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaSignOutAlt, FaSearch } from "react-icons/fa";
import "./UserDashboard.css";
import BookTable from "./BookTable"; // Import the BookTable component

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]); // State to manage order history
  const [showBookTable, setShowBookTable] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const productsResponse = await axios.get("http://localhost:5000/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);

        const wishlistResponse = await axios.get("http://localhost:5000/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const wishlistData = wishlistResponse.data;
        setWishlist(wishlistData.map((item) => item._id));
        setWishlistProducts(wishlistData);

        const cartResponse = await axios.get("http://localhost:5000/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cartData = cartResponse.data;
        setCart(cartData.map((item) => item._id));
        setCartCount(cartData.length);

        const orderHistoryResponse = await axios.get('http://localhost:5000/orders1', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderHistory(orderHistoryResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const goToProducts = () => {
    setShowWishlist(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLike = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (wishlist.includes(productId)) {
        await axios.delete(`http://localhost:5000/wishlist/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(wishlist.filter((id) => id !== productId));
        setWishlistProducts(wishlistProducts.filter((product) => product._id !== productId));
      } else {
        await axios.post(
          "http://localhost:5000/wishlist",
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const wishlistResponse = await axios.get("http://localhost:5000/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const wishlistData = wishlistResponse.data;
        setWishlist(wishlistData.map((item) => item._id));
        setWishlistProducts(wishlistData);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Error updating wishlist. Please try again later.");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (cart.includes(productId)) {
        await axios.delete(`http://localhost:5000/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(cart.filter((id) => id !== productId));
        setCartCount(cartCount - 1);
      } else {
        await axios.post(
          "http://localhost:5000/cart",
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCart([...cart, productId]);
        setCartCount(cartCount + 1);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Error updating cart. Please try again later.");
    }
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const goToHistory = () => {
    navigate("/history");
  };

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };

  const handleBookTableClick = () => {
    setShowBookTable(true);
  };

  const renderSideNav = () => (
    <div className="side-nav1">
      <h3>MENU</h3>
      <div className="button-container1">
        <button onClick={goToProducts}>Products</button>
        <button onClick={goToCart}>Go to Cart ({cartCount})</button>
        <button onClick={goToHistory}>Order History</button>
        <button onClick={toggleWishlist}>{showWishlist ? "Hide Wishlist" : "Show Wishlist"}</button>
        <button onClick={handleBookTableClick}>Book Table</button>
      </div>
      <button onClick={handleLogout} className="logout-button1">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );

  return (
    <div className="user-dashboard-container1">
      {renderSideNav()}
      <div className="main-content1">
        <h1>User Dashboard</h1>

        {/* Conditionally render BookTable */}
        {showBookTable ? (
          <BookTable />
        ) : showWishlist ? (
          <div>
            <h2>Wishlist</h2>
            <div className="product-list1">
              {wishlistProducts.length === 0 ? (
                <p>Your wishlist is empty.</p>
              ) : (
                wishlistProducts.map((product) => (
                  <div className="product-card1" key={product._id}>
                    <img
                      src={`http://localhost:5000/uploads/${product.photo}`}
                      alt={product.coffeeName}
                    />
                    <h3>{product.coffeeName}</h3>
                    <p>${product.rate}</p>
                    <div className="product-actions1">
                      <button onClick={() => handleAddToCart(product._id)}>
                        {cart.includes(product._id) ? "Remove from Cart" : "Add to Cart"}
                      </button>
                      <button onClick={() => handleLike(product._id)}>Remove from Wishlist</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="search-container1">
              <input
                type="text"
                placeholder="Search for a product..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-bar1"
              />
              <FaSearch className="search-icon1" />
            </div>
            <h2>Products</h2>
            <div className="product-list1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div className="product-card1" key={product._id}>
                    <img
                      src={`http://localhost:5000/uploads/${product.photo}`}
                      alt={product.coffeeName}
                    />
                    <h3>{product.coffeeName}</h3>
                    <p>${product.rate}</p>
                    <div className="product-actions1">
                      <button onClick={() => handleAddToCart(product._id)}>
                        {cart.includes(product._id) ? "Remove from Cart" : "Add to Cart"}
                      </button>
                      <span onClick={() => handleLike(product._id)} className="heart-icon1">
                        {wishlist.includes(product._id) ? (
                          <FaHeart style={{ color: "red" }} />
                        ) : (
                          <FaRegHeart />
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="not-found1">No product found</p>
              )}
            </div>
          </div>
        )}
        <div className="order-history">
          <h2>Order History</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.productName}</td>
                    <td>{order.quantity}</td>
                    <td>${order.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No order history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;