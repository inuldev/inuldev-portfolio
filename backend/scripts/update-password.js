import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Mendapatkan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config/config.development.env') });

// Password yang ingin di-set
const newPassword = 'inuldev123'; // Ganti dengan password yang Anda inginkan

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Definisikan skema User
const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Fungsi untuk update password
async function updatePassword() {
  try {
    // Generate hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('Generated hashed password:', hashedPassword);
    
    // Update password untuk user dengan username 'admin'
    const result = await User.updateOne(
      { userName: 'admin' }, // Filter untuk menemukan user
      { $set: { password: hashedPassword } } // Update password
    );
    
    console.log('Update result:', result);
    
    if (result.matchedCount > 0) {
      console.log('Password updated successfully!');
    } else {
      console.log('User not found. No password was updated.');
    }
    
    // Verifikasi update
    const user = await User.findOne({ userName: 'admin' });
    console.log('User found:', !!user);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
  } catch (error) {
    console.error('Error updating password:', error);
    await mongoose.disconnect();
  }
}

// Jalankan fungsi
updatePassword();
