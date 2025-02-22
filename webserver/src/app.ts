import { config } from './util/env';

import express from "express";
import cookieParser from "cookie-parser";
import nunjucks from "nunjucks";
import { logger } from "./util/log";

import cors from "cors";
import rateLimit from "express-rate-limit";

export const app = express();

//disable x-powered-by header
app.disable("x-powered-by");

//trust the proxy
app.set("trust proxy", "127.0.0.1");

//set CORS
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

//set rate limit to 1000 requests per minute, per IP
app.use(
    rateLimit({
        windowMs: 60 * 1000,
        limit: 1000,
        standardHeaders: 'draft-7',
        legacyHeaders: false
    })
);

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

nunjucks.configure("templates", {
    autoescape: true,
    express: app,
    noCache: process.env.NODE_ENV === "development",
});

app.listen(config.port, () => {
    logger.info(`Server is live on port ${config.port}`);
});
