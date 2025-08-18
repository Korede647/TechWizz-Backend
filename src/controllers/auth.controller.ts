import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthServiceImpl } from "../services/impl/auth.service.impl";
import { LoginDTO } from "../dtos/LoginDTO";
import { CreateUserDTO } from "../dtos/createUserDTO";
import { VerifyEmailDTO } from "../dtos/verifyEmail.dto";

export class AuthController{
    private authService: AuthServiceImpl;

    constructor() {
        this.authService = new AuthServiceImpl()
    }

    public login = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const data: LoginDTO = req.body;
          const { accessToken, refreshToken } = await this.authService.login(data);
          res.status(201).json({ accessToken, refreshToken });
        } catch (error) {
          next(error);
        }
      };
    
      public createUser = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const data: CreateUserDTO = req.body;
          const user = await this.authService.createUser(data);
          res.status(201).json({
            error: false,
            message: `Otp has been sent successfully to your email @ ${user.email}`,
          });
        } catch (error) {
          next(error);
        }
      };
    
      public verifyEmail = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const data: VerifyEmailDTO = req.body;
          const user = await this.authService.verifyEmail(data);
          res.status(StatusCodes.CREATED).json({
            error: false,
            message: "You have successfully registered",
            data: user,
          });
        } catch (error) {
          next(error);
        }
      };


  // public requestPasswordReset = async (
  //   req: Request, 
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> =>{
  //   try {
  //     const data: RequestResetPasswordDTO = req.body;
  //     await this.authService.requestPasswordReset(data);
  //     res.status(StatusCodes.OK).json({ 
  //       message: "Reset link sent to your email" 
  //     });
  //   } catch (error) {
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
  //       message: error 
  //     });
  //   }
  // }

  // public resetPassword = async (
  //   req: Request, 
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const data = req.body;
  //     await this.authService.resetPassword(data);
  //     res.status(StatusCodes.OK).json({
  //        message: "Password reset successful" 
  //       });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(StatusCodes.BAD_REQUEST).json({ 
  //       message: "Internal Server Error" 
  //     });
  //   }
  // }
}
