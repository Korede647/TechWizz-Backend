
// import { ChangePasswordDTO } from '../dto/resetPassword.dto';

import { CreateUserDTO } from "../dtos/createUserDTO";
import { User } from "../generated/prisma";

export interface UserService {
    createUser(data: CreateUserDTO): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
    deleteUser(id: number): Promise<void>;
    profile(id: number): Promise<Omit<User, "password">>
    // setPassword(id: number, data: ChangePasswordDTO): Promise<void>
    uploadProfilePic(id: number, data: { profilePic: string }): Promise<Object | any>;
}