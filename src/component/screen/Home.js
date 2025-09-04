import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./Home.css";
import Card from "../Card";
import { Link } from "react-router-dom"; // Import Link for navigation

// API base: set REACT_APP_API_URL in Vercel (e.g. https://tozato-web.onrender.com)
// top of file
// const API_BASE = process.env.REACT_APP_API_URL || 'https://tozato-web.onrender.com';


function Home() {
  const [search, setSearch] = useState('');
  const [foodData, setFoodData] = useState([]);
  const [foodCategory, setFoodCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  // const myRef = useRef();
  // Use state for login status so the component can re-render
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  // This effect listens for the 'authChange' event
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };
    
    window.addEventListener('authChange', handleAuthChange);

    // Clean up the event listener when the component is removed
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);
  // Hero images for carousel

  const heroImages = [
    "https://images.unsplash.com/photo-1504674900240-9c9c0b1c0b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  const loadData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      console.log("Loading food data... (attempt", retryCount + 1, ")");
  let response = await fetch(`http://127.0.0.1:5000/api/foodData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      response = await response.json();
      console.log("Food data response:", response);
      console.log("Food data length:", response?.items);
      console.log("Food categories length:", response?.categories);
      
      // If data is empty and we haven't retried too many times, retry after a delay
      if ((!response?.items || !response?.categories) && retryCount < 3) {
        console.log("Data is empty, retrying in 2 seconds...");
        setTimeout(() => loadData(retryCount + 1), 2000);
        return;
      }
      
      setFoodData(response.items);
      setFoodCategory(response.categories);
    } catch (error) {
      console.error("Error loading data:", error);
      setFoodData([]);
      setFoodCategory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
  //   // Test API connection
  // fetch(`http://127.0.0.1:5000/api/foodData`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log("Direct API test - Food data:", data[0]?.length || 0, "items");
  //     console.log("Direct API test - Categories:", data[1]?.length || 0, "items");
  //   })
  //   .catch(error => {
  //     console.error("Direct API test failed:", error);
  //   });
  }, [loadData]);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []); // Remove foodData and foodCategory dependencies

  const filteredFoodData = foodData.filter((item) => {
    const matchesSearch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
    
    // More comprehensive category matching
    const itemCategory = item.CategoryName || item.categoryName || item.category || item.Category || '';
    const matchesCategory = selectedCategory === 'All' || 
    itemCategory.toLowerCase() === selectedCategory.toLowerCase() ||
    itemCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in-up">
            Delicious Food Delivered to Your Doorstep
          </h1>
          <p className="hero-subtitle">
            Discover amazing dishes from the best restaurants in your area
          </p>
          
          {/* <div className="search-container">
            <input
              className="search-input"
              type="search"
              placeholder="Search for your favorite food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="bi bi-search search-icon"></i>
          </div> */}
        </div>

        {/* Hero Carousel Background */}
        <div className="hero-carousel">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`,
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title scroll-reveal">Food Categories</h2>
          
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="col-6 col-md-3">
                  <div className="category-card loading-skeleton" style={{ height: '150px' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-6 col-md-3">
                <div 
                  className={`category-card hover-lift ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('All')}
                >
                  <div className="category-icon">🍽️</div>
                  <div className="category-name">All Items</div>
                  <div className="category-description">Browse all available dishes</div>
                </div>
              </div>
              
              {Array.isArray(foodCategory) && foodCategory.length > 0 ? (
                foodCategory.map((category, index) => (
                  <div key={category._id || index} className="col-6 col-md-3">
                    <div 
                      className={`category-card hover-lift ${selectedCategory === category.CategoryName ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.CategoryName)}
                    >
                      <div className="category-icon">
                        {category.CategoryName === 'Pizza' ? '🍕' :
                         category.CategoryName === 'Burger' ? '🍔' :
                         category.CategoryName === 'Pasta' ? '🍝' :
                         category.CategoryName === 'Salad' ? '🥗' :
                         category.CategoryName === 'Dessert' ? '🍰' :
                         category.CategoryName === 'Drinks' ? '🥤' : '🍽️'}
                      </div>
                      <div className="category-name">{category.CategoryName}</div>
                      <div className="category-description">Delicious {category.CategoryName.toLowerCase()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p className="text-muted">No categories available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Food Items Section */}
      <section className="food-section py-5">
        <div className="container">
          <h2 className="section-title scroll-reveal">Our Menu</h2>
          
          {/* Temporary Debug Panel */}
          {/* {isLoggedIn && (
            <div className="alert alert-info mb-4">
              <strong>Debug:</strong> Food Items: {foodData.length} | Filtered: {filteredFoodData.length} | Category: "{selectedCategory}" | Loading: {loading.toString()}
              <br />
              <button 
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => loadData()}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>
          )} */}
            
          {isLoggedIn ? (
            <>
              {loading ? (
                <div className="row g-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="col-12 col-md-6 col-lg-3">
                      <div className="card loading-skeleton" style={{ height: '300px' }}></div>
                    </div>
                  ))}
                </div>
              ) : filteredFoodData.length > 0 ? (
                <div className="food-grid">
                  {filteredFoodData.map((foodItem, index) => (
                    <div 
                      key={foodItem._id} 
                      className="food-card hover-lift scroll-reveal"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Using Card component as it was in original file */}
                      <Card foodItem={foodItem} option={foodItem.options[0]} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="animate-bounce" style={{ fontSize: '4rem' }}>🍕</div>
                  <h3 className="mt-3">No items found</h3>
                  <p className="text-muted">
                    {search ? `No items found for "${search}"` : `No items found in "${selectedCategory}" category`}
                  </p>
                  <p className="text-muted">Try adjusting your search or category filter</p>
                  <div className="mt-3">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setSearch('');
                        setSelectedCategory('All');
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // If user is NOT logged in, show a prompt with inline styles
            <div 
              className="text-center py-5 scroll-reveal"
              style={{
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '1px dashed #dee2e6',
                padding: '2rem'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Login to See Our Menu
              </h3>
              <p style={{ color: '#6c757d', marginBottom: '2rem', maxWidth: '400px' }}>
                Create an account or sign in to explore our delicious offerings.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/login" className="btn btn-primary btn-lg">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-secondary btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
