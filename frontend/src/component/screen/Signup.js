import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";

function Signup() {
  let navigate = useNavigate();
  const [credential, setcredential] = useState({ name: "", email: "", password: "", location: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return { text: 'Weak', color: 'danger' };
    if (passwordStrength <= 3) return { text: 'Fair', color: 'warning' };
    if (passwordStrength <= 4) return { text: 'Good', color: 'info' };
    return { text: 'Strong', color: 'success' };
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!credential.name || !credential.email || !credential.password || !credential.location) {
      toast.error('Please fill in all fields', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (credential.password.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: credential.name,
          email: credential.email,
          password: credential.password,
          location: credential.location
        })
      });
      
      const json = await response.json();
      console.log(json);

      if (!json.success) {
        toast.error('Email already exists or invalid data', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      
      if (json.success) {
        navigate('/login');
        toast.success('Account created successfully! 🎉', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setcredential({ ...credential, [name]: value });
    
    if (name === 'password') {
      validatePassword(value);
    }
  }

  return (
    <>
      <Navbar />
      
      <div className="signup-container">
        <div className="signup-background">
          <div className="signup-overlay"></div>
        </div>
        
        <div className="signup-content">
          <div className="signup-card animate-fade-in-up">
            <div className="signup-header">
              <div className="signup-icon animate-pulse">
                <i className="bi bi-person-plus"></i>
              </div>
              <h2 className="signup-title">Create Account</h2>
              <p className="signup-subtitle">Join ToZaTo and start ordering delicious food</p>
            </div>
            
            <form onSubmit={handelSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <i className="bi bi-person me-2"></i>
                  Full Name
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name"
                  name='name' 
                  value={credential.name} 
                  onChange={onChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope me-2"></i>
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email"
                  name='email' 
                  value={credential.email} 
                  onChange={onChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-2"></i>
                  Password
                </label>
                <div className="password-input-group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control" 
                    id="password"
                    name='password' 
                    value={credential.password} 
                    onChange={onChange}
                    placeholder="Create a strong password (min 6 characters)"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {credential.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill strength-${getPasswordStrengthText().color}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`strength-text text-${getPasswordStrengthText().color}`}>
                      {getPasswordStrengthText().text}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  <i className="bi bi-geo-alt me-2"></i>
                  Location
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="location"
                  name='location' 
                  value={credential.location} 
                  onChange={onChange}
                  placeholder="Enter your delivery address"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className={`btn btn-primary signup-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </button>
                
                <div className="divider">
                  <span>or</span>
                </div>
                
                <Link to="/login" className="btn btn-outline-primary login-link">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Already have an account? Sign In
                </Link>
              </div>
            </form>
            
            <div className="signup-footer">
              <p className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
