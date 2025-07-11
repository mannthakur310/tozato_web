import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { baseurl } from "../../Urls";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import fetch from 'node-fetch';

function Signup() {
  let navigate=useNavigate();
  const [credential,setcredential] = useState({name:"",email:"",password:"",location:""});

  const handelSubmit=async(e)=>{
    e.preventDefault();
    const respone = await fetch(`${baseurl}/api/createuser`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({name:credential.name,email:credential.email,password:credential.password,location:credential.location})
    })
    const json=await respone.json();
    console.log(json);

    if(!json.success){
      toast.error('enter valid email or password', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // transition: Bounce,
        })
    }
    if(json.success){
      navigate('/login')
      toast.success('Account Created', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // transition: Bounce,
        })
    }
  };

  const onChange=(event)=>{
    setcredential({...credential,[event.target.name]:event.target.value})
  }

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="container justify-content-center text-light">
        <form onSubmit={handelSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputName" className="form-label">
              Name
            </label>
            <input type="text" className="form-control" name='name' value={credential.name} onChange={onChange}/>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" name='email' value={credential.email} onChange={onChange}/>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input type="password" className="form-control" name='password' value={credential.password} onChange={onChange} placeholder="min 6 element"/>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputLocation" className="form-label">
              Location
            </label>
            <input type="text" className="form-control" name='location' value={credential.location} onChange={onChange}/>
          </div>
          <button type="submit" className="btn btn-primary m-3">
            Submit
          </button>
          <button type="submit" className="btn btn-danger m-3 ">
            <Link to="/login" className="text-light text-decoration-none">Already an account</Link>
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
