import { StatusCodes } from "http-status-codes";
import { CreateUserDTO } from "../../dtos/createUserDTO";
import { CustomError } from "../../exceptions/customError.error";
import { db } from "../../config/db";
import { hashPassword } from "../../utils/password.util";
import redisClient from "../../redisClient";
import { UserService } from "../user.service";
import { User } from "@prisma/client";


export class UserServiceImpl implements UserService {
  
    
    async createUser(data: CreateUserDTO): Promise<User> {
        const isUserExists = await db.user.findUnique({
            where: { 
                email: data.email 
            },
        })

        if(isUserExists) {
            throw new CustomError(StatusCodes.BAD_REQUEST, "User already exists with this email");
        }

        const user = await db.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: await hashPassword(data.password),
                role: data.role 
            },
        })

        return user;
    }

    async getUserById(id: string): Promise<User | null> {
      const cacheKey = `user:${id}`

    try{
      const cachedUser= await redisClient.get(cacheKey)
      if(cachedUser){
        return JSON.parse(cachedUser)
      }
    const user = await db.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new CustomError(404, `User with ${id} does not exist`);
    }
    if(user){
      await redisClient.setex(cacheKey, 3600, JSON.stringify(user))
    }

    return user;
  }catch(error){
    throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Error getting user")
  }
     }

    async getAllUsers(): Promise<User[]> {
        const cacheKeys = `users: all`

    const cachedUsers = await redisClient.get(cacheKeys)
    if(cachedUsers){
      return JSON.parse(cachedUsers)
    }
    const users = await db.user.findMany();
    if(users){
      await redisClient.setex(cacheKeys, 3600, JSON.stringify(users))
    }
    return users
    }

    async updateUser(id: string, data: Partial<CreateUserDTO>): Promise<User> {
          const isUserExist = await db.user.findFirst({
      where: {
        id, //id: id
      },
    });
    if (!isUserExist) {
      throw new CustomError(404, `User with ${id} does not exist`);
    }
    const user = await db.user.update({
      where: { id },
      data,
    });
    return user;
    }

    async deleteUser(id: string): Promise<void> {
         const user = await db.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
    }
    await db.user.delete({
      where: { id },
    });
    }

    async profile(id: string): Promise<Omit<User, "password"> > {
          const cacheKey = `user: ${id}`

    const cachedUser = await redisClient.get(cacheKey)

    if(cachedUser){
      return JSON.parse(cachedUser)
    }
    const user = await db.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        `user with id ${id} not found`
      );
    }
    if(user){
      await redisClient.set(cacheKey, JSON.stringify(user))
    }
    return user;
    }


    async uploadProfilePic(
    id: string,
    data: { profilePic: string }
  ): Promise<Object | any> {
//     const user = await db.user.findFirst({
//       where: { id },
//     });

//     if (!user) {
//       throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
//     }
//     const updatedUser = await db.user.update({
//       where: {
//         id,
//       },
//       data: { profilePicture: data.profilePic },
//     });

//     //return updateuser without sensitive fields like password
//     return {
//       id: updatedUser.id,
//       name: updatedUser.firstName,
//       email: updatedUser.email,
//       profilePicture: updatedUser.profilePicture,
//     };
  }

}