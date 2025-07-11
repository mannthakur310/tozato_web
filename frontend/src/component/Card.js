import React,{useEffect, useRef, useState} from "react";
import './card.css'
import { useCart,useDispatchCart } from "./ContextReducer";
import { toast } from "react-toastify";

export default function Card(props) {
  const{_id,img,name}=props.foodItem
  let data = useCart();
  const priceRef=useRef();
  let optionprice = Object.keys(props.option);
  let dispatch=useDispatchCart();
  const [qty, setqty] = useState(1);
  const [size, setsize] = useState("");

  let finalprice=qty * parseInt(props.option[size]);
  useEffect(()=>{
    setsize(priceRef.current.value)
  },[])

const handleAddToCart =async()=>{
    let food=[];
    for(const item of data){
      if(item.id ===_id){
        food=item;
        break;
      }
    }
    if(Object.keys(food).length !== 0){
      if(food.size === size){
        await dispatch({type:"UPDATE",id:_id,price:finalprice,qty:qty})
        return
      }
      else{
        await dispatch({type:"ADD",id:_id,size:size,price:finalprice,qty:qty,name:name})
        return
      } 
      
    }
    await dispatch({type:"ADD",id:_id,size:size,price:finalprice,qty:qty,name:name})
    toast.success('Item Added to Cart', {
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

  return (
    <div
      className="card mt-4 bg-muted border-warning"
      style={{ width: "15rem" }}
    >
      <img src={img}
        className="card-img-top"
        alt="..."
        style={{ height: "25vh", filter: "brightness(85%)" }}
      />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <div className="d-inline-flex inner-card-body">
        <div className="container d-inline-flex pe-0">
          <select
            className="bg-warning custom-select"
            aria-label="Default select example"
            onChange={(e)=>setqty(e.target.value)}
          >{Array.from(Array(4),(e,i)=>{
            return (
              <option key={i+1} value={i+1}>{i+1}</option>
            )
          })}
          </select>
          <select
            className="bg-warning custom-select "
            aria-label="Default select example"
            ref={priceRef}
            onChange={(e)=>setsize(e.target.value)}
          >
            {optionprice.map((data) => {
              return (
                <option key={data} value={data}>
                  {data}
                </option>
              );
            })}
          </select>
        </div>
        <div className="h-100">₹{finalprice}/-</div>
        </div>
        <hr/>
        <button className="btn btn-warning text-black" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
