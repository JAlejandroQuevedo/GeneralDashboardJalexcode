import { Amplify } from "aws-amplify";
import { config } from "../config/config";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.CLIENT_POOL, // tu User Pool ID
      userPoolClientId: config.CLIENT_ID, // tu App client ID de Cognito
      loginWith: {
        oauth: {
          domain: config.COGNITO_DOMAIN, // ej: "tu-dominio.auth.us-east-1.amazoncognito.com"
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [config.CALLBACK_AUTH],
          redirectSignOut: [],
          responseType: "code", // Authorization Code + PKCE
        },
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: config.API_URL,
      region: "us-east-1",
      defaultAuthMode: "userPool",
    },
  },
});
