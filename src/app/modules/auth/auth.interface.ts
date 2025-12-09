import mongoose from "mongoose";

export type TAccount = {
    name: string;
    email: string;
    phoneNumber?: string;
    password: string;
    lastPasswordChange?: Date;
    image?: string;
    isDeleted?: boolean;
    accountStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    role?: "USER" | "ADMIN" | "VOLUNTEER" | "CLINICIAN" | "SuperAdmin";
    isVerified?: boolean;
    otp?: string | null;
    stafId?: string | mongoose.Types.ObjectId | null;
    alreadyFilledRegistrationForm?: boolean;
    adminId?: string | mongoose.Types.ObjectId | null;
    otpExpiry?: Date | null;
    otpExpiresAt?: Date | null;
}


export interface TRegisterPayload extends TAccount {
    
}

export type TLoginPayload = {
    email: string;
    password: string;
}

export type TJwtUser = {
    email: string;
    role?: "USER" | "ADMIN" | "VOLUNTEER" | "CLINICIAN" | "SuperAdmin";
}