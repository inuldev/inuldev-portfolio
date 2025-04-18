const bcrypt = require('bcrypt');

// Password yang ingin di-hash
const password = 'password123'; // Ganti dengan password yang Anda inginkan

// Jumlah salt rounds
const saltRounds = 10;

// Generate hash
bcrypt.genSalt(saltRounds, function(err, salt) {
  if (err) {
    console.error('Error generating salt:', err);
    return;
  }
  
  bcrypt.hash(password, salt, function(err, hash) {
    if (err) {
      console.error('Error generating hash:', err);
      return;
    }
    
    console.log('Password asli:', password);
    console.log('Password hash:', hash);
    console.log('\nAnda dapat menggunakan hash ini untuk memperbarui password di database.');
    console.log('Contoh query MongoDB:');
    console.log(`db.users.updateOne({ userName: "admin" }, { $set: { password: "${hash}" } })`);
    
    // Verifikasi hash
    bcrypt.compare(password, hash, function(err, result) {
      if (err) {
        console.error('Error verifying hash:', err);
        return;
      }
      console.log('\nVerifikasi hash berhasil:', result);
    });
  });
});
