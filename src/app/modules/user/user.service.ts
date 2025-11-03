import { Request } from "express"
import uploadCloud from "../../utils/cloudinary";
import { User_Model } from "./user.schema";
import { Account_Model } from "../auth/auth.schema";
import { TUser } from "./user.interface";


// Create new user
const createUser = async (payload: TUser) => {
  const user = await User_Model.create(payload);
  return user;
};

// Get all users
const getAllUsers = async () => {
  const users = await User_Model.find();
  return users;
};

// Get single user by id
const getUserById = async (userId: string) => {
  const user = await User_Model.findById(userId);
  return user;
};

const update_profile_into_db = async (req: Request) => {
    // upload file and get link
    if (req.file) {
        const uploadedImage = await uploadCloud(req.file);
        req.body.photo = uploadedImage?.secure_url;
    };

    const isExistUser = await Account_Model.findOne({ email: req?.user?.email }).lean()
    const result = await User_Model.findOneAndUpdate({ accountId: isExistUser!._id }, req?.body)
    return result
}



export const user_services = {
    createUser,
    getAllUsers,
    getUserById,
    update_profile_into_db
}