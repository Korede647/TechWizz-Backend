import { Response, Request, NextFunction } from "express";
import { CreateUserDTO } from "../dtos/createUserDTO";
import { UserServiceImpl } from "../services/impl/user.service.impl";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";


export class UserController {
    private userService: UserServiceImpl;

    constructor() {
        this.userService = new UserServiceImpl();
    }

    public createUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userData = req.body as CreateUserDTO;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        }catch (error){
            next(error);
        }
    }

    public getUserById = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | any> => {
        try{
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId)
            if(!user){
                return res.status(404).json({message: "User not found"})
            }
            res.status(200).json(user)
        }catch(error){
            next(error)
        }
    }

    public getAllUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const users = await this.userService.getAllUsers()
            res.status(200).json(users)
        }catch(error){
            next(error)
        }
    }

    public updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userId = req.params.id;
            const userData = req.body as Partial<CreateUserDTO>
            const updateUser = await this.userService.updateUser(userId, userData)
            res.status(200).json(updateUser)
        }catch(error){
            next(error)
        }
    }

    public deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userId = req.params.id;
            const user = await this.userService.deleteUser(userId)
            res.status(200).json(user)
        }catch(error){
            next(error)
        }
    }

    public profile = async(
        req:CustomRequest,
        res:Response,
        next:NextFunction
    ): Promise<void | any> => {
        try{
            const id = req.params.id 
            const user = await this.userService.getUserById(id)

            res.status(StatusCodes.OK).json({
                error: false,
                message: "User profile retrieved successfully",
                data: user,
            });
    }catch(error){
        next(error)
    }
}

// public setPassword = async(
//     req:Request,
//     res:Response,
//     next:NextFunction
// ): Promise<void> =>{
//     try{
//         const id = req.userAuth;
//         const data = req.body as ChangePasswordDTO;
//         const user = await this.userService.setPassword(Number(id), data);
//         res.status(StatusCodes.OK).json({
//             error: false,
//             message: "Password changed successfully",
//         })
//     }catch(error){
//         next(error)
//     }
// }

public updateProfilePic = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // try {
    //   const userId = req.userAuth; 
    //   if (!req.file|| !req.file.path) {
    //     res.status(400).json({
    //       error: true,
    //       message: "No profile image uploaded",
    //     });
    //     return;
    //   }
  
    //   const profilePicUrl = req.file.path; // Cloudinary URL after upload
    //   await this.userService.updateProfilePic(Number(userId), {
    //     profilePic: profilePicUrl,
    //   });
  
    //   res.status(200).json({
    //     error: false,
    //     message: "Profile picture updated successfully",
    //     data: { profilePic: profilePicUrl },
    //   });
    // } catch (error) {
    //   next(error);
    // }
  };
}