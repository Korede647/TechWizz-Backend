import { NextFunction, Response } from "express";
import { CustomRequest } from "./auth.middleware";
import { db } from "../config/db";
import { CustomError } from "../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { USER_ROLE } from "../generated/prisma";


const isAdmin = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const user = await db.user.findUnique({
               where: {
                id: Number(req.userAuth),
               }
            });
            if(!user){
                throw new CustomError(StatusCodes.NOT_FOUND, "User not found")
            }
            if(user.role === USER_ROLE.ADMIN){
                next();
            }else{
                throw new CustomError(StatusCodes.FORBIDDEN, "Access denied")
            }
        }catch(error){
            next(error)
        }
    }

export default isAdmin;