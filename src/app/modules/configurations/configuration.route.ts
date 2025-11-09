import express from "express";
import { configurationController } from "./configuration.controller";

const router = express.Router();

// ✅ Create configuration
router.post("/create/:type", configurationController.createConfiguration);

export const configurationRoutes = router;
