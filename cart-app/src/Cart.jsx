import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8085/cart')
      .then(response => {
        setCart(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the cart!', error);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      <ul className="space-y-4">
        {cart.map(item => (
          <li key={item.item_id} className="bg-white p-4 rounded shadow">
            <p className="text-gray-800">Item ID: {item.item_id}</p>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;