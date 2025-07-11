import React,{useState} from "react";
import Navbar from "../Navbar";
import { Link,useNavigate } from "react-router-dom";
import { baseurl } from "../../Urls";
import { toast } from "react-toastify";

function Login() {
  let navigate=useNavigate();
  const [credential,setcredential] = useState({email:"",password:""});

  const handelSubmit=async(e)=>{
    e.preventDefault();
    const respone = await fetch(`${baseurl}/api/loginuser`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({email:credential.email,password:credential.password})
    })
    const json=await respone.json();
    console.log(json);

    if(!json.success){
      toast.error('invalid email or password', {
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
      localStorage.setItem("userEmail",credential.email);
      localStorage.setItem("authToken",json.authToken);
      navigate('/');
      toast.success('Logged In', {
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
      <div className="container justify-content-center text-light" >
        <form onSubmit={handelSubmit}>
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
            <input type="password" className="form-control" name='password' value={credential.password} onChange={onChange}/>
          </div>
          <button type="submit" className="btn btn-primary m-3">
            Submit
          </button>
          <button type="submit" className="btn btn-danger m-3" onChange={onChange}>
            <Link to="/signup" className="text-light text-decoration-none">
              Not an account
            </Link>
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
