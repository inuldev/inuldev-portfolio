import cloudinary from "cloudinary";

import { app } from "./app.js";
import { loadConfig } from "./config/configLoader.js";
import { connectDatabase } from "./config/database.js";

const config = loadConfig();

connectDatabase();

cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const PORT = config.port || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`)
);

app.get("/", (req, res) => res.json("server started"));
