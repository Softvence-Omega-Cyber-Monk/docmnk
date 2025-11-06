// userManagement.service.ts
import { UserManagementModel } from "./userManagement.model";
import { Account_Model } from "../auth/auth.schema";
import { IUserManagement } from "./userManagement.interface";
import { TAccount } from "../auth/auth.interface";

// 🟢 Create new user
const createUserManagement = async (data: IUserManagement) => {
  // Create UserManagement document
  const user = await UserManagementModel.create(data);

  // Check if already exists in Auth
  const existingAuth = await Account_Model.findOne({ email: data.companyInfo.email });

  if (existingAuth) {
    // Update existing Auth account
    existingAuth.role = data.companyInfo.role as TAccount["role"];
    existingAuth.isVerified = data.verificationStatus === "verified";
    existingAuth.accountStatus = data.status === "active" ? "ACTIVE" : "INACTIVE";
    await existingAuth.save();
  } else {
    // Throw error if not found
    throw new Error("Auth account not found for the provided email.");
    
  }

  return user;
};

// 🟡 Get all users
const getAllUsers = async () => {
  return await UserManagementModel.find();
};

// 🟠 Get single user by ID
const getSingleUser = async (id: string) => {
  return await UserManagementModel.findById(id);
};

// 🔵 Update user (and sync with Auth)
const updateUserManagement = async (id: string, updateData: Partial<IUserManagement>) => {
  const user = await UserManagementModel.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) throw new Error("User not found");

  const auth = await Account_Model.findOne({ email: user.companyInfo.email });
  if (auth) {
    if (updateData.companyInfo?.role) {
      auth.role = updateData.companyInfo.role as TAccount["role"];
    }

    if (updateData.status) {
      const statusMap: Record<string, TAccount["accountStatus"]> = {
        active: "ACTIVE",
        inactive: "INACTIVE",
        pending: "INACTIVE",
      };
      auth.accountStatus = statusMap[updateData.status];
    }

    if (updateData.verificationStatus) {
      auth.isVerified = updateData.verificationStatus === "verified";
    }

    await auth.save();
  }

  return user;
};

// 🔴 Delete user
const deleteUserManagement = async (id: string) => {
  const user = await UserManagementModel.findByIdAndDelete(id);
  return user;
};

export const UserManagementService = {
  createUserManagement,
  getAllUsers,
  getSingleUser,
  updateUserManagement,
  deleteUserManagement,
};
