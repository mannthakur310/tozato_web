import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Modal from "../Modal";
import Cart from "./screen/Cart";
import { useCart } from "./ContextReducer";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const handelLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
    toast.warning("Login to Order", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  };
  let data = useCart();
  const [cartView, setcartView] = useState(false);
  return (
    <>
      <nav className="navbar  navbar-expand-lg navbar-light bg-warning color:black">
        <div className="container-fluid">
          <Link className="navbar-brand fs-4 fst-italic fw-bolder" to="/">
            GoFooD
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item ">
                <Link
                  className="nav-link active fs-6 fw-normal "
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              {localStorage.getItem("authToken") ? (
                <li className="nav-item ">
                  <Link
                    className="nav-link fs-6 text-dark fw-normal"
                    aria-current="page"
                    to="/myorder"
                  >
                    My Orders
                  </Link>
                </li>
              ) : (
                ""
              )}
            </ul>
            {!localStorage.getItem("authToken") ? (
              <div className="d-flex">
                <Link
                  className="btn btn-light text-primary me-2"
                  type="button"
                  to="/signup"
                >
                  Signup
                </Link>
                <Link
                  className="btn btn-light text-primary"
                  type="button"
                  to="/login"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="d-flex">
                <button
                  className="btn btn-light text-success me-2"
                  type="button"
                  onClick={(e) => setcartView(true)}
                >
                  My Cart{" "}
                  <Badge pill bg="danger">
                    {data.length}
                  </Badge>
                </button>
                {cartView ? (
                  <Modal onClose={(e) => setcartView(false)}>
                    <Cart />
                  </Modal>
                ) : (null)}
                <button
                  className="btn btn-light text-danger"
                  type="button"
                  onClick={handelLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav> 
    </>
  );
}

export default Navbar;


