import { z } from "zod";

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    switch (issue.expected) {
      case "string":
        return { message: "文字列型ではありません" };
      case "undefined":
        return {
          message: "必須",
        };
    }
  }

  switch (issue.code) {
    case z.ZodIssueCode.too_small:
      return { message: `少なくとも${issue.minimum}文字以上にしてください` };
    case z.ZodIssueCode.too_big:
      return { message: `最大で${issue.maximum}文字以内にしてください` };
    case z.ZodIssueCode.custom:
      return { message: `${(issue.params || {}).minimum}以下です` };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
