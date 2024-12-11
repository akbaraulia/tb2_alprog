# Ringkasan Sistem Keranjang Belanja Bardak Docmart

## Pendahuluan
Sistem ini adalah aplikasi e-commerce sederhana yang memungkinkan pengguna untuk menambahkan item ke keranjang belanja, melakukan pembayaran, dan melihat riwayat pembelian. Aplikasi ini terdiri dari frontend yang dibangun dengan React dan backend yang dibangun dengan FastAPI.

## Struktur dan Proses

### Backend (FastAPI)

#### Koneksi Database
- Menggunakan PostgreSQL sebagai database.
- Koneksi ke database diinisialisasi di awal aplikasi.

#### Konfigurasi CORS
- Menggunakan middleware CORS untuk mengizinkan permintaan dari frontend yang berjalan di `http://localhost:3000`.

#### Model Data
- **Item**: Model untuk item yang dijual.
- **CartItem**: Model untuk item yang ada di keranjang.
- **CartHistoryItem**: Model untuk riwayat pembelian.

#### Endpoint API
- `GET /items`: Mengambil semua item dari tabel `items`.
- `POST /cart`: Menambahkan item ke tabel `cart`.
- `GET /cart`: Mengambil semua item dari tabel `cart`.
- `POST /cart/history`: Menambahkan item ke tabel `cart_history` dengan waktu pembelian.
- `GET /cart/history`: Mengambil semua item dari tabel `cart_history` dengan informasi tambahan dari tabel `items`.

### Frontend (React)

#### State Management
- **cartItems**: Menyimpan item yang ada di keranjang.
- **isCartOpen**: Menyimpan status apakah keranjang terbuka atau tidak.
- **isPaymentOpen**: Menyimpan status apakah form pembayaran terbuka atau tidak.
- **isReceiptVisible**: Menyimpan status apakah tanda terima terlihat atau tidak.
- **isProcessingPayment**: Menyimpan status apakah pembayaran sedang diproses atau tidak.
- **isHistoryOpen**: Menyimpan status apakah riwayat pembelian terbuka atau tidak.
- **cardNumber, expiryDate, cvv**: Menyimpan informasi kartu kredit.
- **cardNumberError, expiryDateError, cvvError**: Menyimpan pesan kesalahan validasi.
- **receiptItems**: Menyimpan item yang ada di tanda terima.
- **historyItems**: Menyimpan item yang ada di riwayat pembelian.
- **items**: Menyimpan semua item yang diambil dari backend.

#### Fungsi Utama
- **addToCart(item)**: Menambahkan item ke keranjang.
- **removeFromCart(itemId)**: Menghapus item dari keranjang.
- **toggleCart()**: Mengubah status keranjang terbuka atau tidak.
- **handlePayment()**: Membuka form pembayaran.
- **validateCardNumber(number), validateExpiryDate(date), validateCvv(cvv)**: Memvalidasi input kartu kredit.
- **processPayment()**: Memproses pembayaran dan mengirim data ke backend.
- **fetchHistory()**: Mengambil riwayat pembelian dari backend.

#### Komponen Utama
- **App**: Komponen utama yang mengelola state dan menampilkan komponen lain.
- **Items**: Komponen untuk menampilkan daftar item.
- **Cart**: Komponen untuk menampilkan item di keranjang (dalam App).

#### Gaya CSS
- Menggunakan Tailwind CSS untuk styling.
- Menambahkan gaya khusus untuk loader dan popup.

## Alur Sistem

### Mengambil Data Item
- Saat aplikasi dimuat, frontend mengirim permintaan `GET /items` ke backend untuk mengambil semua item.
- Data item disimpan di state `items`.

### Menambahkan Item ke Keranjang
- Pengguna dapat menambahkan item ke keranjang dengan mengklik tombol "Tambahkan ke Keranjang".
- Item ditambahkan ke state `cartItems`.

### Melihat Keranjang
- Pengguna dapat membuka keranjang dengan mengklik ikon keranjang di navbar.
- Keranjang menampilkan semua item yang telah ditambahkan.

### Melakukan Pembayaran
- Pengguna dapat membuka form pembayaran dengan mengklik tombol "Lanjutkan Pembayaran".
- Pengguna mengisi informasi kartu kredit dan mengklik tombol "Bayar".
- Jika validasi berhasil, data keranjang dikirim ke backend dengan permintaan `POST /cart/history`.
- Setelah pembayaran berhasil, tanda terima ditampilkan dan keranjang dikosongkan.

### Melihat Riwayat Pembelian
- Pengguna dapat membuka riwayat pembelian dengan mengklik tombol "Riwayat" di navbar.
- Riwayat pembelian menampilkan semua item yang telah dibeli dengan informasi tambahan dari tabel `items`.



## Penjelasan Algoritma

1. Mengambil Data Item dari Backend

- Algoritma: Mengambil data item dari backend saat komponen dimuat.
- Kode: 

```
useEffect(() => {
  axios.get('http://127.0.0.1:8085/items')
    .then(response => {
      setItems(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the items!', error);
    });
}, []);
```

- Penjelasan: Saat komponen App dimuat, permintaan GET dikirim ke endpoint /items untuk mengambil semua item dari backend. Data item yang diterima kemudian disimpan dalam state items.

2. . Menambahkan Item ke Keranjang
Algoritma: Menambahkan item ke keranjang belanja.
Kode:

```
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
```

Penjelasan: Fungsi addToCart menambahkan item ke keranjang. Jika item sudah ada di keranjang, kuantitas item tersebut ditambah satu. Jika item belum ada, item baru ditambahkan ke keranjang dengan kuantitas satu.


3. Menghapus Item dari Keranjang
Algoritma: Menghapus item dari keranjang belanja.
Kode:

```
const removeFromCart = (itemId) => {
  setCartItems((prevItems) =>
    prevItems
      .map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      )
      .filter((i) => i.quantity > 0)
  );
};
```

Penjelasan: Fungsi removeFromCart mengurangi kuantitas item di keranjang. Jika kuantitas item menjadi nol, item tersebut dihapus dari keranjang.

4. Memproses Pembayaran
Algoritma: Memvalidasi informasi kartu kredit dan mengirim data keranjang ke backend.
Kode:

```
const processPayment = () => {
  validateCardNumber(cardNumber);
  validateExpiryDate(expiryDate);
  validateCvv(cvv);

  if (cardNumberError || expiryDateError || cvvError) {
    alert('Form tidak valid');
    return;
  }

  setIsProcessingPayment(true);

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
```

Penjelasan: Fungsi processPayment memvalidasi informasi kartu kredit. Jika validasi berhasil, data keranjang dikirim ke backend dengan permintaan POST /cart/history. Setelah pembayaran berhasil, tanda terima ditampilkan dan keranjang dikosongkan.


5. Mengambil Riwayat Pembelian
Algoritma: Mengambil riwayat pembelian dari backend dan menampilkan dalam popup.
Kode:

```
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
```

Penjelasan: Fungsi fetchHistory mengirim permintaan GET /cart/history ke backend untuk mengambil riwayat pembelian. Data yang diterima kemudian diproses untuk menambahkan nama dan harga item berdasarkan item_id, dan disimpan dalam state historyItems.


## Kesimpulan
Sistem ini menyediakan fitur dasar e-commerce seperti menambahkan item ke keranjang, melakukan pembayaran, dan melihat riwayat pembelian. Dengan menggunakan React untuk frontend dan FastAPI untuk backend, sistem ini dapat diimplementasikan dengan mudah dan efisien.

## Cara Menjalankan Proyek

## Clone Repository

Clone repository dari GitHub:

```
git clone https://github.com/akbaraulia/tb2_alprog.git
cd tb2_alprog
```

## Menjalankan Backend (FastAPI)
## Buat dan Aktifkan Virtual Environment

```

python -m venv venv
source venv/bin/activate  # Untuk Windows: venv\Scripts\activate
```

Install Dependencies

```
pip install -r requirements.txt
```

Jalankan Server FastAPI

```
uvicorn main:app --reload --port=8085
```

## Menjalankan Frontend (React)

```
cd cart-app
npm install
npm start
```