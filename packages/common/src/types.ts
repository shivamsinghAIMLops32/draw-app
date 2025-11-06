import {email, z} from "zod";


export const CreateUserSchema = z.object({
    username: z.string().min(5).max(20),
    email:z.email(),
    password:z.string().min(6)
});

export const LoginUserSchema = z.object({
    email:z.email(),
    password:z.string().min(6)
})

export const CreateRoomSchema = z.object({
    name:z.string().min(3).max(10)
})