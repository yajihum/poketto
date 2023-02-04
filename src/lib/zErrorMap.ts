import { z } from "zod";

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string") {
      return { message: "文字列型ではありません" };
    }
    if (issue.received === "undefined") {
      return {
        message: "必須",
      };
    }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    return { message: `少なくとも${issue.minimum}文字以上にしてください` };
  }
  if (issue.code === z.ZodIssueCode.too_big) {
    return { message: `最大で${issue.maximum}文字以内にしてください` };
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: `${(issue.params || {}).minimum}以下です` };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
