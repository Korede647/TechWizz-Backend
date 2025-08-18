import { User } from "@prisma/client";
import { LoginDTO } from "../dtos/LoginDTO";
import { CreateUserDTO } from "../dtos/createUserDTO";
import { VerifyEmailDTO } from "../dtos/verifyEmail.dto";

export interface AuthService {
    login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }>;
    createUser(data: CreateUserDTO): Promise<User>;
    verifyEmail(data: VerifyEmailDTO): Promise<User>;
  
  }