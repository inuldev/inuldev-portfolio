import express from "express";
import { incCounter } from "../controller/Visitors.js";

export const visitorRoute = express.Router();
visitorRoute.get("/increment", incCounter);

export default visitorRoute;
