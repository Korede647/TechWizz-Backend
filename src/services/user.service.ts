
// import { ChangePasswordDTO } from '../dto/resetPassword.dto';

import { CreateUserDTO } from "../dtos/createUserDTO";
import { User } from "@prisma/client";

export interface UserService {
    createUser(data: CreateUserDTO): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: string, data: Partial<CreateUserDTO>): Promise<User>;
    deleteUser(id: string): Promise<void>;
    profile(id: string): Promise<Omit<User, "password">>
    // setPassword(id: number, data: ChangePasswordDTO): Promise<void>
    uploadProfilePic(id: string, data: { profilePic: string }): Promise<Object | any>;
}