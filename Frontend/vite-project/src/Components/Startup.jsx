import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="home-container">
    
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="content">
        <h1 className="title">
          🚀 NASA <span>Space Hackathon</span>
        </h1>
        <p className="subtitle">
         Turning Nasa Data into  Discovery
        </p>

        <div className="button-group">
          <Link to="/register" className="btn primary">
           Register
          </Link>
          <Link to="/login" className="btn secondary">
            Login
          </Link>
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} NASA Space Hackathon. All rights reserved  By Hitesh Dubey.
      </footer>
    </div>
  );
};

export default Home;
