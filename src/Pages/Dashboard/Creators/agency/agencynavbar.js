import React, { useState, useEffect } from "react";
import "../../../../Components/Navbar/NavBar.css";
import logo from "../../../../Components/globalAssets/platty.png";
import { Link } from "react-router-dom";
import routes from "../../../../Config/routes.js";

const Navbar = () => {
  

  return (
    <div className="navbar">
      <div className="logo">
        <Link >
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <Link
        to={routes.user}
        className="user"
        style={{ textDecoration: "none" }}
      >
      </Link>
      <ul className="menu">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
       
      </ul>
    </div>
  );
};

export default Navbar;
