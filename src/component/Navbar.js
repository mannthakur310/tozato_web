import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Modal from "../Modal";
import Cart from "./screen/Cart";
import { useCart } from "./ContextReducer";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handelLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    window.dispatchEvent(new Event("authChange"));
    navigate('/', { replace: true, state: { timestamp: Date.now() } });
    toast.warning("Login to Order", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  let data = useCart();
  const [cartView, setcartView] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95' 
          : 'bg-transparent'
      }`} role="navigation" aria-label="Main navigation">
        <div className="container">
          <Link 
            className="navbar-brand d-flex align-items-center animate-fade-in-left" 
            to="/"
            style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: ' rgba(255, 107, 53, 0.9)',
              textDecoration: 'none'
            }}
          >
            <span className="me-2 animate-pulse">🍕</span>
            ToZaTo
          </Link>

          <button
            className={`navbar-toggler border-0 ${isMobileMenuOpen ? 'collapsed' : ''}`}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link position-relative ${isActive('/') ? 'active' : ''}`}
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="d-flex align-items-center">
                    <i className="bi bi-house-door me-1"></i>
                    Home
                  </span>
                </Link>
              </li>
              
              {localStorage.getItem("authToken") && (
                <li className="nav-item">
                  <Link
                    className={`nav-link position-relative ${isActive('/myorder') ? 'active' : ''}`}
                    to="/myorder"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="d-flex align-items-center">
                      <i className="bi bi-list-ul me-1"></i>
                      My Orders
                    </span>
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2 animate-fade-in-right">
              {!localStorage.getItem("authToken") ? (
                <>
                  <Link
                    className="btn btn-outline-primary hover-lift"
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Signup
                  </Link>
                  <Link
                    className="btn btn-primary hover-lift"
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-success hover-lift position-relative"
                    onClick={(e) => {
                      setcartView(true);
                      setIsMobileMenuOpen(false);
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={cartView}
                    aria-controls="cart-root"
                  >
                    <i className="bi bi-cart3 me-1"></i>
                    My Cart
                    {data.length > 0 && (
                      <Badge 
                        pill 
                        bg="danger" 
                        className="position-absolute top-0 start-100 translate-middle animate-bounce"
                        style={{fontSize: '0.7rem'}}
                      >
                        {data.length}
                      </Badge>
                    )}
                  </button>
                  
                  {cartView && (
                    <Modal onClose={(e) => setcartView(false)}>
                      <Cart onClose={() => setcartView(false)} />
                    </Modal>
                  )}
                  
                  <button
                    className="btn btn-outline-danger hover-lift"
                    onClick={() => {
                      handelLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    aria-label="Logout"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div style={{ height: '80px' }}></div>
    </>
  );
}

export default Navbar;


