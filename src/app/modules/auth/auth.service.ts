import { AppError } from "../../utils/app_error";
import { TAccount, TLoginPayload, TRegisterPayload } from "./auth.interface";
import { Account_Model } from "./auth.schema";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { TUser } from "../user/user.interface";
import { User_Model } from "../user/user.schema";
import mongoose from "mongoose";
import { jwtHelpers } from "../../utils/JWT";
import { configs } from "../../configs";
import { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../../utils/mail_sender";
import { isAccountExist } from "../../utils/isAccountExist";
// register user
const register_user_into_db = async (payload: TRegisterPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check if the account already exists
    const isExistAccount = await Account_Model.findOne(
      { email: payload?.email },
      null,
      { session }
    );
    if (isExistAccount) {
      throw new AppError("Account already exist!!", httpStatus.BAD_REQUEST);
    }

    // Hash the password
    const hashPassword = bcrypt.hashSync(payload?.password, 10);

    // Create account
    const accountPayload: TAccount = {
      email: payload.email,
      password: hashPassword,
      lastPasswordChange: new Date(),
    };
    const newAccount = await Account_Model.create([accountPayload], {
      session,
    });

    // Create user
    const userPayload: TUser = {
      name: payload?.name,
      accountId: newAccount[0]._id,
    };
    await User_Model.create([userPayload], { session });
    // make verified link
    const verifiedToken = jwtHelpers.generateToken(
      {
        email: payload?.email,
      },
      configs.jwt.verified_token as Secret,
      "5m"
    );
    const verificationLink = `${configs.jwt.front_end_url}/verified?token=${verifiedToken}`;
    // Commit the transaction
    await session.commitTransaction();
    await sendMail({
      to: payload?.email,
      subject: "Thanks for creating account!",
      textBody: `New Account successfully created on ${new Date().toLocaleDateString()}`,
      name: payload?.name,
      htmlBody: `
            <p>Thanks for creating an account with us. We’re excited to have you on board! Click the button below to
                verify your email and activate your account:</p>


            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" target="_blank"
                    style="background-color: #4CAF50; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 18px;"
                    class="btn">
                    Verify My Email
                </a>
            </div>

            <p>If you did not create this account, please ignore this email.</p>
            `,
    });
    return newAccount;
  } catch (error) {
    console.log(error);
    // Rollback the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// login user
const login_user_from_db = async (payload: TLoginPayload) => {
  // check account info
  const isExistAccount = await isAccountExist(payload?.email);

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isExistAccount.password
  );
  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: isExistAccount.email,
      role: isExistAccount.role,
    },
    configs.jwt.access_token as Secret,
    configs.jwt.access_expires as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: isExistAccount.email,
      role: isExistAccount.role,
    },
    configs.jwt.refresh_token as Secret,
    configs.jwt.refresh_expires as string
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    role: isExistAccount.role,
  };
};

const get_my_profile_from_db = async (email: string) => {
  const isExistAccount = await isAccountExist(email);
  const accountProfile = await User_Model.findOne({
    accountId: isExistAccount._id,
  });
  isExistAccount.password = "";
  return {
    account: isExistAccount,
    profile: accountProfile,
  };
};

const refresh_token_from_db = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.refresh_token as Secret
    );
  } catch (err) {
    throw new AppError("You are not authorized!", httpStatus.UNAUTHORIZED);
  }

  // Check if token payload is valid
  if (!decodedData || !decodedData.email) {
    throw new AppError("Invalid token payload!", httpStatus.BAD_REQUEST);
  }

  const userData = await Account_Model.findOne({
    email: decodedData.email,
    accountStatus: "ACTIVE",
    isDeleted: false,
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData!.email,
      role: userData!.role,
    },
    configs.jwt.access_token as Secret,
    configs.jwt.access_expires as string
  );

  return accessToken;
};

const change_password_from_db = async (
  user: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const isExistAccount = await isAccountExist(user?.email);

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    isExistAccount.password
  );

  if (!isCorrectPassword) {
    throw new AppError("Old password is incorrect", httpStatus.UNAUTHORIZED);
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);
  await Account_Model.findOneAndUpdate(
    { email: isExistAccount.email },
    {
      password: hashedPassword,
      lastPasswordChange: Date(),
    }
  );
  return "Password changed successful.";
};

// const forget_password_from_db = async (email: string) => {
//   const isAccountExists = await isAccountExist(email);
//   const resetToken = jwtHelpers.generateToken(
//     {
//       email: isAccountExists.email,
//       role: isAccountExists.role,
//     },
//     configs.jwt.reset_secret as Secret,
//     configs.jwt.reset_expires as string
//   );

//   const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;
//   const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

//   await sendMail({
//     to: email,
//     subject: "Password reset successful!",
//     textBody: "Your password is successfully reset.",
//     htmlBody: emailTemplate,
//   });

//   return "Check your email for reset link";
// };

// const forget_password_from_db = async (email: string) => {
//   const isAccountExists = await isAccountExist(email);

//   // 🔐 Generate 6-digit verification code
//   const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//   // 🔐 Create JWT token that also contains the verification code
//   const resetToken = jwtHelpers.generateToken(
//     {
//       email: isAccountExists.email,
//       role: isAccountExists.role,
//       code: verificationCode, // add code inside token
//     },
//     configs.jwt.reset_secret as Secret,
//     configs.jwt.reset_expires as string
//   );

//   // 🔗 Create reset link
//   const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;

//   // 📧 Email Template (both link + code)
//   const emailTemplate = `
//     <p>You requested to reset your password.</p>

//     <p><b>Your verification code:</b> <h2>${verificationCode}</h2></p>

//     <p>Or click the link below to reset your password:</p>
//     <a href="${resetPasswordLink}">Reset Password</a>

//     <p>This code will expire soon. If you didn't request this, please ignore.</p>
//   `;

//   await sendMail({
//     to: email,
//     subject: "Password Reset Request",
//     textBody: `Your verification code is: ${verificationCode}`,
//     htmlBody: emailTemplate,
//   });

//   return "Check your email for reset link and verification code";
// };

// const forget_password_from_db = async (email: string) => {
//   const isAccountExists = await isAccountExist(email);

//   if (!isAccountExists) {
//     throw new AppError("Account not found", httpStatus.NOT_FOUND);
//   }

//   // Generate 6-digit OTP
//   const verificationCode = Math.floor(
//     100000 + Math.random() * 900000
//   ).toString();

//   // Save OTP inside database (so OTP verify works)
//   await Account_Model.findOneAndUpdate(
//     { email },
//     { otp: verificationCode },
//     { new: true }
//   );

//   // Create reset token
//   const resetToken = jwtHelpers.generateToken(
//     {
//       email: isAccountExists.email,
//       role: isAccountExists.role,
//       code: verificationCode,
//     },
//     configs.jwt.reset_secret as Secret,
//     configs.jwt.reset_expires as string
//   );

//   // Create link
//   const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${email}`;

//   // Email Template
//   const emailTemplate = `
//     <p>You requested to reset your password.</p>

//     <p><b>Your Verification Code:</b></p>
//     <h2 style="font-size: 28px; letter-spacing: 3px;">${verificationCode}</h2>

//     <p>You can also reset using the link below:</p>
//     <a href="${resetPasswordLink}" style="color: blue;">Reset Password</a>

//     <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
//   `;

//   // Send email
//   await sendMail({
//     to: email,
//     subject: "Password Reset Request",
//     textBody: `Your OTP is ${verificationCode}. Reset Link: ${resetPasswordLink}`,
//     htmlBody: emailTemplate,
//   });

//   return "Reset instructions sent: OTP + Reset link";
// };


const forget_password_from_db= async (email: string) => {
  const account = await Account_Model.findOne({ email });
  if (!account) throw new AppError("Account not found!", 404);

  // 🔐 Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ⏱ Expiry 5 minutes
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  account.otp = otp;
  account.otpExpiry = otpExpiry;
  await account.save();

  // 🔗 Optional: create reset link with JWT
  const resetToken = jwtHelpers.generateToken(
    { email: account.email, otp },
    configs.jwt.reset_secret as Secret,
    configs.jwt.reset_expires as string
  );
  const resetLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${account.email}`;

  // 📧 Send email
  const emailTemplate = `
    <p>You requested to reset your password.</p>
    <p><b>Your OTP:</b> <h2>${otp}</h2></p>
    <p>Or click this link:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This OTP will expire in 5 minutes.</p>
  `;

  await sendMail({
    to: email,
    subject: "Password Reset Request",
    textBody: `Your OTP is: ${otp}`,
    htmlBody: emailTemplate,
  });

  return "Check your email for OTP and reset link.";
};

const reset_password_into_db = async (
  token: string,
  email: string,
  newPassword: string
) => {
  let decodedData: JwtPayload;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.reset_secret as Secret
    );
  } catch (err) {
    throw new AppError(
      "Your reset link is expire. Submit new link request!!",
      httpStatus.UNAUTHORIZED
    );
  }

  const isAccountExists = await isAccountExist(email);

  const hashedPassword: string = await bcrypt.hash(newPassword, 10);

  await Account_Model.findOneAndUpdate(
    { email: isAccountExists.email },
    {
      password: hashedPassword,
      lastPasswordChange: Date(),
    }
  );
  return "Password reset successfully!";
};

const reset_password_into_db_otp = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const account = await Account_Model.findOne({ email });
  if (!account) throw new AppError("Account not found!", 404);

  // Trim values
  const dbOtp = account.otp?.trim();
  
  const inputOtp = otp.trim();


  if (!dbOtp || dbOtp !== inputOtp) {
    throw new AppError("Invalid OTP!", 400);
  }

  // Check expiry
  if (!account.otpExpiry || Date.now() > account.otpExpiry.getTime()) {
    throw new AppError("OTP expired!", 400);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear OTP
  account.password = hashedPassword;
  account.otp = undefined;
  account.otpExpiry = undefined;
  account.lastPasswordChange = new Date();
  await account.save();

  return "Password reset successfully!";
};

// const verified_account_into_db = async (token: string) => {
//   try {
//     const { email } = jwtHelpers.verifyToken(
//       token,
//       configs.jwt.verified_token as string
//     );
//     // check account is already verified or blocked
//     const isExistAccount = await Account_Model.findOne({ email });
//     // check account
//     if (!isExistAccount) {
//       throw new AppError("Account not found!!", httpStatus.NOT_FOUND);
//     }
//     if (isExistAccount.isDeleted) {
//       throw new AppError("Account deleted !!", httpStatus.BAD_REQUEST);
//     }
//     const result = await Account_Model.findOneAndUpdate(
//       { email },
//       { isVerified: true },
//       { new: true }
//     );

//     return result;
//   } catch (error) {
//     throw new AppError("Invalid or Expired token!!!", httpStatus.BAD_REQUEST);
//   }
// };

const verified_account_into_db = async (token: string, code?: string) => {
  try {
    // 🔐 Decode token
    const decoded: any = jwtHelpers.verifyToken(
      token,
      configs.jwt.verified_token as string
    );

    const email = decoded.email;
    const savedCode = decoded.code; // OTP from email

    // 🔎 Check if account exists
    const account = await Account_Model.findOne({ email });

    if (!account) {
      throw new AppError("Account not found!", httpStatus.NOT_FOUND);
    }

    if (account.isDeleted) {
      throw new AppError("Account deleted!", httpStatus.BAD_REQUEST);
    }

    // 🆚 If code is provided → verify OTP
    if (code) {
      if (savedCode !== code) {
        throw new AppError(
          "Invalid verification code!",
          httpStatus.BAD_REQUEST
        );
      }
    }

    // ✔ Mark user as verified
    const result = await Account_Model.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    return result;
  } catch (error) {
    throw new AppError("Invalid or expired token!", httpStatus.BAD_REQUEST);
  }
};

const get_new_verification_link_from_db = async (email: string) => {
  const isExistAccount = await isAccountExist(email);

  const verifiedToken = jwtHelpers.generateToken(
    {
      email,
    },
    configs.jwt.verified_token as Secret,
    "5m"
  );
  const verificationLink = `${configs.jwt.front_end_url}/verified?token=${verifiedToken}`;
  await sendMail({
    to: email,
    subject: "New Verification link",
    textBody: `New Account verification link is successfully created on ${new Date().toLocaleDateString()}`,
    htmlBody: `
            <p>Thanks for creating an account with us. We’re excited to have you on board! Click the button below to
                verify your email and activate your account:</p>


            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" target="_blank"
                    style="background-color: #4CAF50; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 18px;"
                    class="btn">
                    Verify My Email
                </a>
            </div>

            <p>If you did not create this account, please ignore this email.</p>
            `,
  });

  return null;
};

export const auth_services = {
  register_user_into_db,
  login_user_from_db,
  get_my_profile_from_db,
  refresh_token_from_db,
  change_password_from_db,
  forget_password_from_db,
  reset_password_into_db,
  verified_account_into_db,
  get_new_verification_link_from_db,
  reset_password_into_db_otp,
};
