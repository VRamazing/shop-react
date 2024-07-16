import { createContext, useReducer, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateItemQuantity: () => {}
});

function shoppingCartReducer(state, action){
  switch(action.type){
    case "ADD_ITEM":
        const updatedItems = [...state.items];
  
        const existingCartItemIndex = updatedItems.findIndex(
          (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];
  
        if (existingCartItem) {
          const updatedItem = {
            ...existingCartItem,
            quantity: existingCartItem.quantity + 1,
          };
          updatedItems[existingCartItemIndex] = updatedItem;
        } else {
          const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
          updatedItems.push({
            id: action.payload,
            name: product.title,
            price: product.price,
            quantity: 1,
          });
        }
  
        return {
          ...state,
          items: updatedItems,
        };
        break
    
    case "UPDATE_ITEM":
        const updatedItems2 = [...state.items];

        const updatedItemIndex = updatedItems2.findIndex(
          (item) => item.id === action.payload.productId
        );
  
        const updatedItem = {
          ...updatedItems2[updatedItemIndex],
        };
  
        updatedItem.quantity += action.payload.amount;
  
        if (updatedItem.quantity <= 0) {
          updatedItems2.splice(updatedItemIndex, 1);
        } else {
          updatedItems2[updatedItemIndex] = updatedItem;
        }
  
        return {
          ...state,
          items: updatedItems2,
        };
      
    default:
      return state;
  }
}

export default function CartContextProvider({children}){
    const [shoppingCartState, shoppingCartDispatch ] = useReducer(shoppingCartReducer , {
      items: [],
    })
    const [shoppingCart, setShoppingCart] = useState({
      items: [],
    });
    
      function handleAddItemToCart(id) {
        shoppingCartDispatch({
          type: "ADD_ITEM",
          payload: id
        })
      }
    
      function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
          type: "UPDATE_ITEM",
          payload: {
            productId, amount
          }
        })
      }

      const ctxValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
      }

      return (<CartContext.Provider value={ctxValue}>
        {children}
      </CartContext.Provider>)
}