import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, "Invalid Password"),
});


export type loginSchemaType = z.infer<typeof loginSchema>;
