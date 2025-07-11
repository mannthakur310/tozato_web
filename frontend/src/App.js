import React from 'react'
import Home from './component/screen/Home'
import Login from './component/screen/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Signup from './component/screen/Signup';
import { CartProvider } from './component/ContextReducer';
import Myorder from './component/screen/Myorder';

function App() {
  return (
  <CartProvider>
    <Router>
      <div>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/signup" element={<Signup/>}></Route>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/myorder" element={<Myorder/>}></Route>
      </Routes>
      </div>
    </Router>
  </CartProvider>
  )
}

export default App

