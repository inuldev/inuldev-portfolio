import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadConfig = () => {
  const environment = process.env.NODE_ENV || "development";

  // Jika bukan di Vercel (development local), gunakan file .env
  if (!process.env.VERCEL) {
    const configPath = path.join(__dirname, `config.${environment}.env`);
    const result = dotenv.config({ path: configPath });

    if (result.error) {
      throw new Error(`Error loading config file: ${result.error}`);
    }
  }

  // Verifikasi environment variables yang dibutuhkan
  const requiredEnvVars = [
    "PORT",
    "MONGO_URI",
    "SECRET_KEY",
    "EMAIL",
    "PASSWORD",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "FRONTEND_URL",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }

  return {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    secretKey: process.env.SECRET_KEY,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    frontendUrl: process.env.FRONTEND_URL,
  };
};
