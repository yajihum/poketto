import { ZodError } from "zod";
import { LoggedinUserInfo, LoggedinUserSchema } from "../zod/schema";

export const getUserInfo = async (
  id: string
): Promise<LoggedinUserInfo | undefined> => {
  const data = fetch(`/api/user/loggedin/info?id=${id}`).then((d) => {
    try {
      return LoggedinUserSchema.parse(d);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new Error(e.issues[0].message);
      }
    }
  });
  if (!data) return undefined;
  return data;
};
