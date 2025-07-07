import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('user');
      setIsLoggedIn(userData !== null && userData !== undefined);
    };


    checkLoginStatus();


    window.addEventListener('storage', checkLoginStatus);

    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">RoDev</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-post">Create Post</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link" 
                    onClick={handleLogout} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;