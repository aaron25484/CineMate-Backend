import { auth } from "express-oauth2-jwt-bearer";
import config from "../config/config";

export const checkJWTMiddleware = auth({
  audience: config.auth0.audience as string,
  issuerBaseURL: config.auth0.issuer as string,
});
