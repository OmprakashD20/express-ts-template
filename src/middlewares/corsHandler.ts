import cors, { CorsOptions } from "cors";

import config from "@/config";
import { ForbiddenError } from "@/utils/errors";

const AllowedOrigins = new Set(config.env.PROD_ORIGINS);

if (config.env.NODE_ENV === "development") {
  AllowedOrigins.add("http://localhost:5173");
  AllowedOrigins.add("http://127.0.0.1:5173");
}

const options: CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      AllowedOrigins.has(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new ForbiddenError("CORS policy: Access denied"));
    }
  },
  // Method [OPTIONS] is for Preflight Requests for Methods [POST], [PATCH], [PUT], [DELETE]
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

export const CorsHandler = cors(options);
