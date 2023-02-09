import axios, { AxiosError } from "axios";

/* import { getAuth } from 'firebase/auth';
import app from 'utils/firebase/firebase'; */
import {
  APIResponseErrorSchema,
  APIResponseSchema,
} from "../types/APIResponse";

export const fetcher = (url: string): Promise<any> =>
  axios
    .get(url)
    .then((response) => {
      const parsedBody = APIResponseSchema.safeParse(response.data);
      if (!parsedBody.success) {
        throw Error(`APIからのレスポンスが異常です`);
      } else {
        return parsedBody.data.data;
      }
    })
    .catch((response: AxiosError) => {
      const parsedBody = APIResponseErrorSchema.safeParse(
        response.response?.data
      );
      if (parsedBody.success) {
        throw Error(`${parsedBody.data.message}`);
      } else {
        throw Error(`${response.message}`);
      }
    });
