
import { comparePassword, hashPassword } from "../../utils/password.util";
import { AuthService } from "../auth.service";
import Jwt, { Secret, SignOptions }  from "jsonwebtoken"
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { User, USER_ROLE } from "@prisma/client";
import { VerifyEmailDTO } from "../../dtos/verifyEmail.dto";
import { LoginDTO } from "../../dtos/LoginDTO";
import { CreateUserDTO } from "../../dtos/createUserDTO";
import { generateOtp } from "../../utils/otp.util";
// import { welcomeEmail, sendOtpEmail } from "../../templates/Email";
// import { ResetPasswordDTO, RequestResetPasswordDTO } from "../../dto/resetPassword.dto";


export class AuthServiceImpl implements AuthService{

    async login(
        data: LoginDTO
      ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await db.user.findUnique({
          where: {
            email: data.email,
          },
        });
        if (!user) {
          throw new CustomError(401, "Invalid password or email");
        }
    
        const isPasswordValid = await comparePassword(data.password, user.password || "");
        if (!isPasswordValid) {
          throw new CustomError(401, "Invalid password or email");
        }
    
        //
        const fullName = user.firstName + " " + user.lastName;
        const accessToken = this.generateAccessToken(user.id, fullName, user.role);
    
        const refreshToken = this.generateRefreshToken(
          user.id,
          fullName,
          user.role
        );
    
        return { accessToken, refreshToken };
      }

    async verifyEmail(data: VerifyEmailDTO): Promise<User> {
        const user = await db.user.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (!user) {
          throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
        }
        if (user.emailVerified) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
        }
        if (!user.otp || !user.otpExpiresAt) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            "OTP is not available for this user"
          );
        }

    
        const isOtPValid = await comparePassword(data.otp, user.otp);
        if (!isOtPValid) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
        }
    
        const isExpiredOtp = user.otpExpiresAt < new Date();
    
        if (isExpiredOtp) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
        }
    
        const userReg = await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
            otp: null,
            otpExpiresAt: null,
          },
        });
        //
    
        // await welcomeEmail({
        //   to: userReg.email,
        //   subject: "Welcome to Futurerify",
        //   name: userReg.firstName + " " + userReg.lastName,
        // });
    
        return userReg;
      }
    
    
      async createUser(data: CreateUserDTO): Promise<User> {
        const otp = generateOtp();
        const isUserExist = await db.user.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (isUserExist) {
          throw new CustomError(409, "oops email already taken");
        }
    
        const hashedOtp = await hashPassword(otp);
        const maRetries = 3;
        for (let attempt = 1; attempt <= maRetries; attempt++) {
          try {
            return await db.$transaction(async (transaction) => {
              const user = await transaction.user.create({
                data: {
                  email: data.email,
                  password: await hashPassword(data.password),
                  firstName: data.firstName,
                  lastName: data.lastName,
                  role: data.role,
                  otp: hashedOtp,
                  otpExpiresAt: this.generateOtpExpiration(),
                },
              });
    
            //   await sendOtpEmail({
            //     to: data.email,
            //     subject: "Verify your email",
            //     otp,
            //   });
              return user;
            });
          } catch (error) {
            console.warn(`Retry ${attempt} due to transaction failure`, error);
            if (attempt === maRetries) {
              throw new CustomError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to create user after multiple retry"
              );
            }
          }
        }
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Unexpected error during user creation"
        );
    
       
      }


      generateAccessToken = (userId: string, name: string, role: USER_ROLE): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const secret: Secret = process.env.JWT_SECRET;

  return Jwt.sign(
    { id: userId, name, role },
    secret,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES } as SignOptions
  );
};

     generateRefreshToken = (userId: string, name: string, role: USER_ROLE): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const secret: Secret = process.env.JWT_SECRET;

  return Jwt.sign(
    { id: userId, name, role },
    secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES } as SignOptions
  );
};


        generateOtpExpiration(){
            return new Date(Date.now() + 10 * 60 * 1000)
        }
    }

