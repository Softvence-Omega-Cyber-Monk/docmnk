import { Router } from "express";
import { EventManagementController } from "./eventManagement.controller";

const router = Router();

// Camp routes
router.post("/create", EventManagementController.createCamp);
router.get("/getall", EventManagementController.getAllCamps);
router.get("/getSingle/:id", EventManagementController.getSingleCamp);
router.put("/update/:id", EventManagementController.updateCamp);
router.delete("/deletCamp/:id", EventManagementController.deleteCamp);

export const eventManagementRouter = router;
