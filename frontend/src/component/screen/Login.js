import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  let navigate = useNavigate();
  const [credential, setcredential] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();
    
    if (!credential.email || !credential.password) {
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

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/loginuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: credential.email, password: credential.password })
      });
      
      const json = await response.json();
      console.log(json);

      if (!json.success) {
        toast.error('Invalid email or password', {
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
        localStorage.setItem("userEmail", credential.email);
        localStorage.setItem("authToken", json.authToken);
        navigate('/');
        toast.success('Welcome back! 🎉', {
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
      toast.error('Login failed. Please try again.', {
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
    setcredential({ ...credential, [event.target.name]: event.target.value })
  }

  return (
    <>
      <Navbar />
      
      <div className="login-container">
        <div className="login-background">
          <div className="login-overlay"></div>
        </div>
        
        <div className="login-content">
          <div className="login-card animate-fade-in-up">
            <div className="login-header">
              <div className="login-icon animate-pulse">
                <i className="bi bi-person-circle"></i>
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to your account to continue</p>
            </div>
            
            <form onSubmit={handelSubmit} className="login-form">
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
                    placeholder="Enter your password"
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
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className={`btn btn-primary login-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </button>
                
                <div className="divider">
                  <span>or</span>
                </div>
                
                <Link to="/signup" className="btn btn-outline-primary signup-link">
                  <i className="bi bi-person-plus me-2"></i>
                  Create New Account
                </Link>
              </div>
            </form>
            
            <div className="login-footer">
              <p className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Your data is protected with industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
