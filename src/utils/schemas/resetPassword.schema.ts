import { z } from "zod";


export const resetPAsswordSchema = z.object({
    password: z.string().min(1, "Invalid Password"),
});


export type resetPAsswordSchemaType = z.infer<typeof resetPAsswordSchema>;
