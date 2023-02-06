import { NextApiResponse } from "next";
import {
  generateAPIResponseError,
  generateAPIResponseSuccess,
  JSON,
} from "../types/APIResponse";

const fetchResponse = (func: Promise<any>, res: NextApiResponse) => {
  func
    .then((returnValue: JSON) => {
      res.status(200).json(generateAPIResponseSuccess(returnValue));
    })
    .catch((e: Error) => {
      res.status(500).json(generateAPIResponseError(e.message));
    });
};

export default fetchResponse;
