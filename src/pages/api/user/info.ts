import type { NextApiResponse } from "next";
import {
  APIResponse,
  NextApiRequestWithBody,
} from "../../../types/APIResponse";
import methodHandler from "../../../util/methodHandler";
import fetchResponse from "../../../util/fetchResponse";
import { fetchUserInfo } from "../../../lib/module/user";
import errorHandler from "../../../util/errorHandler";

const handler = (
  req: NextApiRequestWithBody,
  res: NextApiResponse<APIResponse>
) => {
  const { id } = req.query;

  if (typeof id !== "string") return errorHandler(res, 501);

  methodHandler(
    {
      GET: () => fetchResponse(fetchUserInfo(id), res),
    },
    req.method,
    res
  );
};

export default handler;
