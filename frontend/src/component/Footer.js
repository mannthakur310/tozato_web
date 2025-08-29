import React from "react";

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
              <p className="text-muted mb-3">
                Delivering delicious food experiences with passion and quality. 
                Your favorite dishes, delivered to your doorstep.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-light hover-scale" style={{fontSize: '1.5rem'}}>
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  Menu
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h6 className="mb-3">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  Food Delivery
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  Catering
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  Takeaway
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-lift d-inline-block">
                  Corporate Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h6 className="mb-3">Contact Info</h6>
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                <span className="text-muted">123 Food Street, Cuisine City, CC 12345</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone-fill me-2 text-primary"></i>
                <span className="text-muted">+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                <span className="text-muted">info@tozato.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-top border-secondary pt-4 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-muted mb-0">
                © {currentYear} ToZaTo. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-3 justify-content-md-end">
                <a href="#" className="text-muted text-decoration-none small hover-lift">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted text-decoration-none small hover-lift">
                  Terms of Service
                </a>
                <a href="#" className="text-muted text-decoration-none small hover-lift">
                  Cookie Policy
                </a>
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

