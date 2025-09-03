import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5 mt-5 animate-fade-in-up">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <h5 className="mb-3 d-flex align-items-center">
                <span className="me-2 animate-pulse">🍕</span>
                ToZaTo
              </h5>
              <p className="text-white-50 mb-3">
                Delivering delicious food experiences with passion and quality. 
                Your favorite dishes, delivered to your doorstep.
              </p>
              <div className="d-flex gap-3" aria-label="Social links">
                <button type="button" aria-label="Facebook" className="btn btn-link p-0 text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-facebook"></i>
                </button>
                <button type="button" aria-label="Twitter" className="btn btn-link p-0 text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-twitter"></i>
                </button>
                <button type="button" aria-label="Instagram" className="btn btn-link p-0 text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-instagram"></i>
                </button>
                <button type="button" aria-label="LinkedIn" className="btn btn-link p-0 text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-linkedin"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="mb-3 text-light">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-lift d-inline-block">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/menu" className="text-white-50 text-decoration-none hover-lift d-inline-block">Menu</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white-50 text-decoration-none hover-lift d-inline-block">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white-50 text-decoration-none hover-lift d-inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h6 className="mb-3 text-light">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/services/delivery" className="text-white-50 text-decoration-none hover-lift d-inline-block">Food Delivery</Link>
              </li>
              <li className="mb-2">
                <Link to="/services/catering" className="text-white-50 text-decoration-none hover-lift d-inline-block">Catering</Link>
              </li>
              <li className="mb-2">
                <Link to="/services/takeaway" className="text-white-50 text-decoration-none hover-lift d-inline-block">Takeaway</Link>
              </li>
              <li className="mb-2">
                <Link to="/services/corporate" className="text-white-50 text-decoration-none hover-lift d-inline-block">Corporate Orders</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h6 className="mb-3 text-light">Contact Info</h6>
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                <span className="text-white-50">123 Food Street, Cuisine City, CC 12345</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone-fill me-2 text-primary"></i>
                <span className="text-white-50">+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                <span className="text-white-50">info@tozato.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-top border-secondary pt-4 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-white-50 mb-0">
                © {currentYear} ToZaTo. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-3 justify-content-md-end">
                <Link to="/privacy" className="text-white-50 text-decoration-none small hover-lift">Privacy Policy</Link>
                <Link to="/terms" className="text-white-50 text-decoration-none small hover-lift">Terms of Service</Link>
                <Link to="/cookies" className="text-white-50 text-decoration-none small hover-lift">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className="btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg hover-lift"
        style={{
          width: '50px',
          height: '50px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </footer>
  );
}

export default Footer;

