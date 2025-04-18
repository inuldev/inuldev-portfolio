# MERN Portfolio dengan Admin Dashboard

Aplikasi portfolio berbasis MERN stack (MongoDB, Express, React, Node.js) dengan panel admin untuk mengelola konten secara dinamis.

## Deskripsi

Aplikasi ini adalah portfolio pribadi yang memungkinkan pemiliknya untuk menampilkan keterampilan, proyek, dan pengalaman mereka. Dilengkapi dengan panel admin yang komprehensif untuk memperbarui semua konten dan melihat statistik pengunjung. Aplikasi ini dirancang dengan pendekatan mobile-first dan responsif untuk berbagai ukuran layar.

## Fitur Utama

- **Portofolio Pribadi**

  - Tampilan banner/hero section dengan animasi menarik
  - Bagian "About Me" dengan informasi pribadi dan CV yang dapat diunduh
  - Showcase skills dan teknologi dengan visualisasi 3D cube
  - Daftar proyek yang dikategorikan (Frontend, Backend, Fullstack)
  - Riwayat pendidikan dan pekerjaan dengan timeline
  - Formulir kontak dengan validasi
  - Dukungan multi-bahasa

- **Admin Panel**

  - Sistem login aman untuk admin
  - Dashboard dengan statistik pengunjung
  - Manajemen konten lengkap untuk semua bagian portfolio:
    - Detail profil dan informasi kontak
    - Pengaturan banner dan gambar latar belakang
    - Manajemen timeline pendidikan dan pekerjaan
    - Pengelolaan skills dan bahasa pemrograman
    - Manajemen proyek dengan kategori
    - Pengaturan link media sosial
    - Pengelolaan feedback dari pengunjung

- **Fitur Tambahan**

  - Pelacakan pengunjung website dengan statistik real-time
  - Penyimpanan gambar di cloud (Cloudinary)
  - Animasi halus dengan Framer Motion
  - Responsif untuk berbagai ukuran layar dengan Bootstrap
  - Progress bar navigasi
  - Bottom navigation bar untuk perangkat mobile
  - Mode tema gelap/terang

## Teknologi yang Digunakan

- **Frontend**:

  - React 18 dengan Hooks dan Functional Components
  - Redux Toolkit untuk state management
  - React Router v6 untuk navigasi
  - Bootstrap 5 dan React Bootstrap untuk UI
  - Framer Motion untuk animasi
  - Axios untuk HTTP requests
  - React Toastify untuk notifikasi
  - React Icons dan Bootstrap Icons
  - React CountUp, React Fast Marquee, dan Typewriter Effect
  - React Intersection Observer untuk animasi scroll

- **Backend**:

  - Node.js dengan Express
  - MongoDB dengan Mongoose ODM
  - JWT untuk autentikasi dengan expiry time
  - Bcrypt untuk password hashing
  - Cookie Parser untuk manajemen cookie
  - CORS untuk keamanan cross-origin
  - Request-IP untuk pelacakan pengunjung

- **Layanan Pihak Ketiga**:
  - Cloudinary untuk penyimpanan dan manajemen gambar
  - Nodemailer untuk pengiriman email dari formulir kontak

## Persyaratan Sistem

- Node.js (versi 14 atau lebih tinggi)
- MongoDB (lokal atau Atlas)
- Akun Cloudinary untuk penyimpanan gambar
- Akun Gmail dengan App Password (untuk fitur pengiriman email)

## Struktur Proyek

```
mern-portfolio/
├── backend/                # Kode server-side
│   ├── config/             # Konfigurasi database dan environment
|   |   ├── config.example.env # Template konfigurasi
|   |   ├── config.development.env # Konfigurasi development (diabaikan git)
|   |   ├── config.production.env # Konfigurasi production (diabaikan git)
|   |   ├── configLoader.js # Fungsi untuk memuat konfigurasi
|   |   └── database.js     # Fungsi untuk koneksi database
|   ├── controller/         # Controller untuk rute API
│   ├── middlewares/        # Middleware untuk rute API
│   ├── model/              # Model data MongoDB
│   ├── routes/             # Rute API
│   ├── scripts/            # Script utilitas
|   |   └── generate-password-hash.js # Script untuk generate password hash
│   ├── app.js              # Konfigurasi server
│   └── server.js           # Entry point server
│
└── frontend/               # Kode client-side
    ├── public/             # Static files
    └── src/
        ├── assets/         # Gambar dan aset statis
        ├── components/     # React components
        │   ├── AboutMe/    # Komponen halaman About
        │   ├── AdminPanel/ # Komponen panel admin
        │   ├── Banner/     # Komponen hero section
        │   ├── Contact/    # Komponen halaman kontak
        │   ├── EducationWork/ # Komponen timeline
        │   ├── Login/      # Komponen halaman login
        │   ├── NavBar/     # Komponen navigasi
        │   ├── Pages/      # Komponen halaman utama
        │   ├── Projects/   # Komponen proyek
        │   ├── ProtectedRoutes/ # Komponen untuk rute terproteksi
        │   ├── Skills/     # Komponen skills
        │   └── VisitorStat/ # Komponen statistik pengunjung
        ├── redux/          # State management
        │   ├── actions/    # Redux actions
        │   ├── api/        # Konfigurasi API client
        │   └── reducers/   # Redux reducers
        ├── utils/          # Fungsi utilitas
        │   └── authUtils.js # Utilitas untuk autentikasi
        ├── App.js          # Komponen utama React
        └── index.js        # Entry point React
```

## Cara Instalasi

### 1. Clone Repository

```bash
git clone <url-repository>
cd mern-portfolio
```

### 2. Instalasi Dependensi

```bash
# Instalasi dependensi frontend
cd frontend
npm install
cd ..

# Instalasi dependensi backend
cd backend
npm install
cd ..
```

### 3. Konfigurasi Environment Variables

#### Backend

Buat file `config/config.development.env` di dalam folder `backend` dan isi dengan nilai yang sesuai:

```env
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Secret Key
SECRET_KEY=your_secret_key_here

# Email Configuration
EMAIL=your_email@gmail.com
PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Environment
NODE_ENV=development
```

#### Frontend

Buat file `.env.development` di dalam folder `frontend` dan isi dengan nilai yang sesuai:

```env
# API URL - Change to your production URL in production
REACT_APP_API_URL=http://localhost:5000

# Environment
REACT_APP_NODE_ENV=development
```

### 4. Menjalankan Aplikasi

#### Mode Development

Untuk menjalankan backend dan frontend secara terpisah:

```bash
# Menjalankan backend
cd backend
npm run dev

# Menjalankan frontend (di terminal terpisah)
cd frontend
npm run dev
```

#### Mode Production

```bash
# Build frontend
cd frontend
npm run build:prod

# Jalankan backend
cd ../backend
npm run prod
```

## Akses Admin Panel

Untuk mengakses panel admin, Anda perlu membuat pengguna admin di database MongoDB Anda. Anda dapat mengakses panel admin melalui rute `/login` dan masuk dengan kredensial yang telah Anda buat.

Contoh pembuatan user admin melalui MongoDB Shell:

```javascript
db.users.insertOne({
  name: "Nama Admin",
  userName: "admin",
  password: "$2b$10$X5mFk4TFXhp5hNi5Y.iAYOc0jK5OwpZ.Jg8eiTHkMFQVLcfxjy7yO", // Hash dari "password123"
});
```

Atau Anda dapat menggunakan script yang disediakan untuk menghasilkan hash password:

```bash
# Di direktori backend
node scripts/generate-password-hash.js
```

Kemudian gunakan hash yang dihasilkan untuk memperbarui password di database.

## Model Data

Aplikasi ini menggunakan model data MongoDB yang komprehensif untuk menyimpan semua informasi portfolio:

- **User**: Menyimpan informasi admin dan semua konten portfolio

  - Informasi profil dan login
  - Data home/banner
  - Informasi about me
  - Timeline pendidikan dan pekerjaan
  - Skills dan bahasa pemrograman
  - Proyek (frontend, backend, fullstack)
  - Link media sosial
  - Feedback dari pengunjung

- **Visitor**: Melacak statistik pengunjung website

## Deployment

Aplikasi ini dapat di-deploy menggunakan layanan seperti:

- **Frontend**: Vercel, Netlify, atau GitHub Pages
- **Backend**: Vercel, Heroku, Railway, atau layanan cloud lainnya
- **Database**: MongoDB Atlas

## Fitur Keamanan

- **JWT Authentication**: Autentikasi menggunakan JSON Web Tokens dengan expiry time 24 jam
- **Password Hashing**: Menggunakan bcrypt untuk menyimpan password dengan aman
- **Secure Cookies**: Cookie dengan flag httpOnly dan secure (di production)
- **Centralized Auth Logic**: Logika autentikasi terpusat di utils/authUtils.js
- **CORS Protection**: Konfigurasi CORS yang aman untuk mencegah akses tidak sah
- **Protected Routes**: Penggunaan React Router untuk melindungi rute admin
- **Input Validation**: Validasi input di sisi server dan client
- **Error Handling**: Penanganan error yang terstandarisasi
- **Token Expiry**: Token JWT dengan masa berlaku yang jelas

## Fitur UI/UX

- **Animasi Smooth**: Menggunakan Framer Motion untuk transisi halaman dan elemen
- **Responsive Design**: Tampilan yang optimal di berbagai ukuran layar
- **Loading States**: Indikator loading untuk operasi asinkron
- **Toast Notifications**: Notifikasi untuk feedback pengguna
- **Progress Bar**: Indikator navigasi halaman
- **Mobile Navigation**: Bottom bar untuk navigasi di perangkat mobile

## Sistem Autentikasi

Aplikasi ini menggunakan sistem autentikasi yang aman dan terstruktur:

### Backend

- **Password Hashing**: Menggunakan bcrypt untuk menyimpan password dengan aman
- **JWT dengan Expiry**: Token JWT dengan masa berlaku 24 jam
- **Secure Cookies**: Cookie dengan flag httpOnly dan secure di production
- **Middleware Autentikasi**: Middleware untuk memverifikasi token dari cookie atau header Authorization
- **Error Handling**: Penanganan error yang spesifik untuk berbagai kasus autentikasi

### Frontend

- **Centralized Auth Logic**: Logika autentikasi terpusat di `utils/authUtils.js`
- **Token Storage**: Token disimpan di cookie (utama) dan localStorage (fallback)
- **Protected Routes**: Komponen `ProtectedRoutes` untuk melindungi rute admin
- **Axios Interceptors**: Interceptor untuk menambahkan token ke semua request
- **Auto Logout**: Penanganan otomatis untuk token yang tidak valid atau kadaluarsa

### Fitur Tambahan

- **Script Generate Password**: Script untuk menghasilkan hash password
- **Cookie Cleanup**: Pembersihan cookie yang tertinggal saat aplikasi dimuat
- **Cross-Domain Support**: Dukungan untuk cookie di berbagai domain dan lingkungan

## Catatan Penting

- Pastikan untuk mengatur CORS di backend jika frontend dan backend di-deploy di domain yang berbeda
- Untuk fitur email, pastikan Anda menggunakan App Password dari Gmail, bukan password akun biasa
- Pastikan MongoDB Anda dapat diakses dari server tempat Anda men-deploy aplikasi
- Jangan lupa untuk mengubah NODE_ENV menjadi 'production' saat di-deploy ke production
- Perhatikan batas ukuran upload gambar (50MB) saat menggunakan Cloudinary
- Untuk mengubah password admin, gunakan script `generate-password-hash.js` untuk menghasilkan hash
