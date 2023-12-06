import { z } from "zod";


export const createNewUserSchema = z.object({
    firstName: z.string().min(1, "Invalid first name"),
    lastName: z.string().min(1, "Invalid last name"),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});


export type createNewUserSchemaType = z.infer<typeof createNewUserSchema>;
