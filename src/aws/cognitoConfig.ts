import { CognitoUserPool } from "amazon-cognito-identity-js";
import type { PoolDataType } from "../types";
import { config } from "../config/config";

const poolData: PoolDataType = {
  UserPoolId: config.CLIENT_POOL,
  ClientId: config.CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);
