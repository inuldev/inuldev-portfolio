import bcrypt from 'bcrypt';

/**
 * Script sederhana untuk menghasilkan hash password menggunakan bcrypt
 * Cara penggunaan: 
 * 1. Ubah nilai password di bawah ini
 * 2. Jalankan script dengan perintah: node scripts/generate-password-hash.js
 */

// Password yang ingin di-hash
const password = 'password123'; // Ganti dengan password yang Anda inginkan

// Jumlah salt rounds (semakin tinggi semakin aman tapi lebih lambat)
const saltRounds = 10;

// Fungsi untuk menghasilkan hash
async function generateHash() {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash password dengan salt
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Password asli:', password);
    console.log('Password hash:', hash);
    console.log('\nAnda dapat menggunakan hash ini untuk memperbarui password di database.');
    console.log('Contoh query MongoDB:');
    console.log(`db.users.updateOne({ userName: "admin" }, { $set: { password: "${hash}" } })`);
    
    // Verifikasi hash (opsional, hanya untuk memastikan hash berfungsi)
    const isMatch = await bcrypt.compare(password, hash);
    console.log('\nVerifikasi hash berhasil:', isMatch);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

// Jalankan fungsi
generateHash();
