import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Items = ({ addToCart }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    console.log('Fetching items...');
    axios.get('http://localhost:8085/items')
      .then(response => {
        console.log('Items fetched:', response.data);
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closeItemDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Produk</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <li key={item.id} className="bg-white p-4 rounded shadow flex flex-col items-center">
            <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded mb-4 cursor-pointer" onClick={() => handleItemClick(item)} />
            <div className="text-center">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-600">{formatPrice(item.price)}</p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tambahkan ke Keranjang
            </button>
          </li>
        ))}
      </ul>
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-auto mb-4" />
            <p className="text-gray-600 mb-4">{formatPrice(selectedItem.price)}</p>
            <button onClick={closeItemDetail} className="bg-blue-500 text-white px-4 py-2 rounded">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;