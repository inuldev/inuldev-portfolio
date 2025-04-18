import { hash as _hash } from "bcryptjs";

// Password yang ingin di-hash
const password = "inuldev123"; // Ganti dengan password yang Anda inginkan

// Jumlah salt rounds
const saltRounds = 10;

// Generate hash
_hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("Error generating hash:", err);
    return;
  }

  console.log("Password asli:", password);
  console.log("Password hash:", hash);
});
