import React from "react";
import Delete from '@mui/icons-material/Delete'
import { useCart, useDispatchCart } from "../ContextReducer";
import { baseurl } from "../../Urls";
import { toast } from "react-toastify";

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  if (data.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center fs-3 text-light">
          The Cart is Empty!
        </div>
      </div>
    );
  }
  // const handleRemove = (index)=>{
  //   console.log(index)
  //   dispatch({type:"REMOVE",index:index})
  // }


  const handleCheckOut = async () => {
  let userEmail = localStorage.getItem("userEmail");
  let response = await fetch(`${baseurl}/api/orderDetail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_data: data,
      email: userEmail,
      order_date: new Date().toDateString(),
    }),
  });
  console.log("JSON RESPONSE:::::", response);
  if (response.status === 200) {
    dispatch({ type: "DROP" });
    }
    toast.success('Order Done', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
      })
};

let totalPrice = data.reduce((total, food) => total + food.price, 0);
return (
  <div>
    <div className="container m-auto mt-5 text-light table-responsive  table-responsive-sm table-responsive-md">
      <table className="table">
        <thead className="text-warning fs-4">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Option</th>
            <th scope="col">Amount(₹)</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody className="text-light">
          {data.map((food, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{food.name}</td>
              <td>{food.qty}</td>
              <td>{food.size}</td>
              <td>{food.price}</td>
              <td>
                <button
                  type="button"
                  className="btn p-0 btn-light"
                >
                  <Delete onClick={() => { dispatch({ type: "REMOVE", index: index }) }} />
                </button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="ms-4 text-light">
      <h1 className="fs-3 text-warning">Total Price: ₹{totalPrice}/-</h1>
    </div>
    <div>
      <button className="btn bg-danger mt-3 ms-4 text-light" onClick={handleCheckOut}> Buy Now </button>
    </div>
  </div>
);
}
