import axios from "axios";
import { config } from "../config/config";
import type { FetchIndexType } from "../types";

export const GRAPHQL_ENDPOINT = config.API_URL;

export const fetchIndex = async ({ endpoint, token, key }: FetchIndexType) => {
  try {
    if (!token) return ["Data no disponible"];

    const response = await axios.post(
      GRAPHQL_ENDPOINT,
      { query: endpoint },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return response.data.data[key];
  } catch (error) {
    return ["Data no disponible"];
  }
};
