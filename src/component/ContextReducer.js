import React, { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          img: action.img,
          price: action.price,
        },
      ];

    case "REMOVE":
      let newArray = [...state];
      newArray.splice(action.index, 1);
      return newArray;

    // case "UPDATE":
    //   let arr = [...state];
    //   arr.find((food, index) => {
    //     if (food.id === action.id) {
    //       arr[index] = {
    //         ...food,
    //         qty: parseInt(action.qty) + parseInt(food.qty),
    //         price: action.price + food.price,
    //       };
    //     }
    //   });
    //   return arr;

    case "UPDATE":
      return state.map((food) => {
        if (food.id === action.id) {
          return {
            ...food,
            qty: parseInt(action.qty) + parseInt(food.qty),
            price: action.price + food.price,
          };
        }
        return food;
      });

    case "DROP":
        let emtArray=[];
        return emtArray;

    default:
      console.log("ERROR IN REDUCER");
      return state; 
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
