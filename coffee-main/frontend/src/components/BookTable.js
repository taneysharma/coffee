import React from 'react';
import './BookTable.css'; // Include a separate CSS file for styling

const socialLinks = [
  { platform: 'facebook', url: 'https://facebook.com' },
  { platform: 'twitter', url: 'https://twitter.com' },
  { platform: 'instagram', url: 'https://instagram.com' },
  { platform: 'linkedin', url: 'https://linkedin.com' },
];

const BookTable = () => {
  return (
    <div className="book-table-container">
      {/* Left Section */}
      <div className="working-hours">
        <h2>Working Hours</h2>
        <p>
          <strong>Monday - Friday</strong>
          <br />
          8am - 6pm
        </p>
        <p>
          <strong>Saturday - Sunday</strong>
          <br />
          10am - 4pm
        </p>
        <h3>Restaurant Address</h3>
        <p>India, Haryana</p>
        <hr />
        <p>Call Us: 123-456-789</p>
        <div className="social-links1">
          <span>Follow Us:</span>
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-icon ${link.platform}`}
            >
              <i className={`fab fa-${link.platform}`}></i>
            </a>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="booking-form">
        <h2>Book Your Table</h2>
        <form>
          <div className="form-group">
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Number" required />
            <input type="date" required />
          </div>
          <div className="form-group">
            <input type="time" className="time-input" required />
            <input type="number" placeholder="Guests" required />
          </div>
          <textarea placeholder="Message"></textarea>
          <button type="submit" className="btn-book-now">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTable;
