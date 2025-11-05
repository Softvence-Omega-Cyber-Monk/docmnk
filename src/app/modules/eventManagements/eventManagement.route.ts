import { Router } from "express";
import { EventManagementController } from "./eventManagement.controller";

const router = Router();

// Camp routes
router.post("/create", EventManagementController.createCamp);
router.get("/getall", EventManagementController.getAllCamps);
router.get("/:id", EventManagementController.getSingleCamp);
router.put("/:id", EventManagementController.updateCamp);
router.delete("/deletCamp/:id", EventManagementController.deleteCamp);

export const eventManagementRouter = router;
