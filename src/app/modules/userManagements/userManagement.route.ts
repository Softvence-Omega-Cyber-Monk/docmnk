import express from "express";
import { UserManagementController } from "./userManagement.controller";

const router = express.Router();

router.post("/create", UserManagementController.createUserManagement);
router.get("/getAll", UserManagementController.getAllUserManagement);
router.get("/getSingle/:id", UserManagementController.getSingleUserManagement);
router.put("/update/:id", UserManagementController.updateUserManagement);
router.delete("/delete/:id", UserManagementController.deleteUserManagement);

export const UserManagementRoutes = router;