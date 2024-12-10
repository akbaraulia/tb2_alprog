import React, { useState, useEffect } from 'react';
import Items from './Items.jsx';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [receiptItems, setReceiptItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8085/items')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handlePayment = () => {
    setIsPaymentOpen(true);
    setIsCartOpen(false);
  };

  const validateCardNumber = (number) => {
    if (!/^\d{16}$/.test(number)) {
      setCardNumberError('Nomor kartu tidak valid');
    } else {
      setCardNumberError('');
    }
  };

  const validateExpiryDate = (date) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) {
      setExpiryDateError('Tanggal valid tidak valid');
    } else {
      setExpiryDateError('');
    }
  };

  const validateCvv = (cvv) => {
    if (!/^\d{3}$/.test(cvv)) {
      setCvvError('CVV tidak valid');
    } else {
      setCvvError('');
    }
  };

  const processPayment = () => {
    validateCardNumber(cardNumber);
    validateExpiryDate(expiryDate);
    validateCvv(cvv);

    if (cardNumberError || expiryDateError || cvvError) {
      alert('Form tidak valid');
      return;
    }

    setIsProcessingPayment(true);

    // Push cart items to history
    const promises = cartItems.map(item => {
      return axios.post('http://127.0.0.1:8085/cart/history', {
        item_id: item.id,
        quantity: item.quantity
      });
    });

    Promise.all(promises)
      .then(() => {
        setTimeout(() => {
          setIsProcessingPayment(false);
          setIsPaymentOpen(false);
          setIsReceiptVisible(true);
          setReceiptItems(cartItems);
          setCartItems([]);
          setCardNumber('');
          setExpiryDate('');
          setCvv('');
        }, 2000);
      })
      .catch(error => {
        console.error('There was an error processing the payment!', error);
        setIsProcessingPayment(false);
        alert('Terjadi kesalahan saat memproses pembayaran');
      });
  };

  const fetchHistory = () => {
    axios.get('http://127.0.0.1:8085/cart/history')
      .then(response => {
        const historyWithNames = response.data.map(historyItem => {
          const item = items.find(i => i.id === historyItem.item_id);
          return {
            ...historyItem,
            name: item ? item.name : 'Unknown Item',
            price: item ? item.price : 0
          };
        });
        setHistoryItems(historyWithNames);
        setIsHistoryOpen(true);
      })
      .catch(error => {
        console.error('There was an error fetching the history!', error);
      });
  };

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const receiptTotalQuantity = receiptItems.reduce((total, item) => total + item.quantity, 0);
  const receiptTotalPrice = receiptItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center">Keranjang Belanja Bardak Docmart</h1>
        <div className="flex items-center">
          <button onClick={toggleCart} className="relative">
            <FontAwesomeIcon icon={faShoppingCart} className="text-3xl" />
            {cartItems.length > 0 && (  
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                {cartItems.length}
              </span>
            )}
          </button>
          <button onClick={fetchHistory} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">Riwayat</button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <section className="hero bg-white p-8 rounded shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Selamat Datang di Toko Kami</h2>
          <h5 className="text-lg font-semibold mb-4">            (TB 2 Algoritma Dan Pemrograman)</h5>
          <p className="text-gray-700">Cari Produk terbaik docmart pilihan bardak docmart handal, no KW, no jore, just GG.   </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Items addToCart={addToCart} />
          {isReceiptVisible && (
            <div className="bg-white p-8 rounded shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Tanda Terima</h2>
              <p className="text-gray-800 font-bold">Bardak Docmart Indo's Store</p>
              <p className="text-gray-600">Jalan Raya Puncak nomor 123, Kecamatan Cisarua, Kabupaten Bogor</p>
              <ul className="space-y-4 mt-4">
                {receiptItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-800">{item.name}</p>
                      <p className="text-gray-600">{item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</p>
                    </div>
                    <div className="text-gray-800">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p className="text-gray-800 font-bold">Total Kuantitas: {receiptTotalQuantity}</p>
                <p className="text-gray-800 font-bold">Total Harga: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(receiptTotalPrice)}</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-blue-600 text-white p-4 text-center">
        <p>&copy; 2024 Bardak Docmart Indo's Store. All rights reserved.</p>
      </footer>
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Keranjang</h2>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-800">{item.name}</p>
                    <p className="text-gray-600">{item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">-</button>
                    <button onClick={() => addToCart(item)} className="bg-green-500 text-white px-2 py-1 rounded ml-2">+</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-gray-800 font-bold">Total Kuantitas: {totalQuantity}</p>
              <p className="text-gray-800 font-bold">Total Harga: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}</p>
            </div>
            <div className="mt-4">
              <button onClick={handlePayment} className="bg-green-500 text-white px-4 py-2 rounded">Lanjutkan Pembayaran</button>
              <button onClick={toggleCart} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Tutup</button>
            </div>
          </div>
        </div>
      )}
      {isPaymentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Pembayaran</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Jenis Kartu</label>
              <select className="w-full p-2 border rounded">
                <option value="visa">Visa</option>
                <option value="mastercard">MasterCard</option>
                <option value="americanexpress">American Express</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nomor Kartu</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  validateCardNumber(e.target.value);
                }}
                maxLength="16"
              />
              {cardNumberError && <p className="text-red-500 text-sm">{cardNumberError}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tanggal Valid</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  validateExpiryDate(e.target.value);
                }}
                maxLength="5"
              />
              {expiryDateError && <p className="text-red-500 text-sm">{expiryDateError}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value);
                  validateCvv(e.target.value);
                }}
                maxLength="3"
              />
              {cvvError && <p className="text-red-500 text-sm">{cvvError}</p>}
            </div>
            <div className="mt-4">
              <button onClick={processPayment} className="bg-green-500 text-white px-4 py-2 rounded">Bayar</button>
              <button onClick={() => setIsPaymentOpen(false)} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Tutup</button>
            </div>
          </div>
        </div>
      )}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96 text-center">
            <h2 className="text-2xl font-bold mb-4">Melakukan Pembayaran...</h2>
            <div className="loader"></div>
          </div>
        </div>
      )}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Riwayat Pembelian</h2>
            <ul className="space-y-4">
              {historyItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-800">{item.name}</p>
                    <p className="text-gray-600">{item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</p>
                    <p className="text-gray-600">{item.purchase_date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <button onClick={() => setIsHistoryOpen(false)} className="bg-blue-500 text-white px-4 py-2 rounded">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;