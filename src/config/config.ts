import dotenv from "dotenv";

type Tconfig = {
  [key: string]: EnvironmentConfig;
};

type EnvironmentConfig = {
  app: Appconfig;
  auth0: Auth0Config;
  cloudinary: CloudinaryConfig;
};

type CloudinaryConfig = {
  cloud_name: string | undefined;
  api_key: string | undefined;
  api_secret: string | undefined;
};

type Appconfig = {
  PORT: string | number;
};

type Auth0Config = {
  client_origin?: string;
  audience?: string;
  issuer?: string;
};

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

const ENV = process.env.NODE_ENV ?? "development";

const CONFIG: Tconfig = {
  development: {
    app: {
      PORT: process.env.PORT || 4001,
    },
    auth0: {
      client_origin: process.env.APP_ORIGIN,
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER,
    },
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    },
  },
  production: {
    app: {
      PORT: process.env.PORT || 4002,
    },
    auth0: {
      client_origin: process.env.APP_ORIGIN,
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER,
    },
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    },
  },
};

export const cloudinaryConfig = CONFIG[ENV].cloudinary;

export default CONFIG[ENV];
