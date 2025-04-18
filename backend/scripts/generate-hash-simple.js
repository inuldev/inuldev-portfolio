const bcrypt = require('bcrypt');

// Password yang ingin di-hash
const password = 'inuldev123';

// Generate hash
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nGunakan hash ini untuk memperbarui password di database secara manual.');
});
