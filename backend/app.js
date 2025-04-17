import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { loadConfig } from "./config/configLoader.js";

export const app = express();
const config = loadConfig();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["*", "Authorization"],
};

app.use(cors(corsOptions));

// Routes
import { userRoute } from "./routes/User.js";
app.use("/admin", userRoute);
