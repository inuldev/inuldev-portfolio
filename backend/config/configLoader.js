import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadConfig = () => {
  const environment = process.env.NODE_ENV || "development";
  const configPath = path.join(__dirname, `config.${environment}.env`);

  const result = dotenv.config({ path: configPath });

  if (result.error) {
    throw new Error(`Error loading config file: ${result.error}`);
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
