import { z } from "zod";


export const forgotPAsswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});


export type ForgotPasswordSchemaType = z.infer<typeof forgotPAsswordSchema>;
