import express from "express";
import { app } from "../app";
import { logRequest } from "../util/log";
import { setCacheTime } from "../middleware/setCacheTime";
import apiRouter from "./api/router";
const ONE_DAY_SEC = 86400;

// static content
app.use("/static", setCacheTime(ONE_DAY_SEC), express.static("dist/client"));

// assets
app.use("/assets", setCacheTime(ONE_DAY_SEC), express.static("app/assets"));

// api routes
app.use("/api", apiRouter);

// For pages that need no templating or dynamic content
const staticRoutes: Record<string, string> = {
    "/": "home.html",
};

for (const [route, view] of Object.entries(staticRoutes)) {
    app.get(route, (req, res) => {
        res.render(view);
    });
}

// For static pages that need templating
const templatedRoutes: Record<string, string> = {
};

for (const [route, view] of Object.entries(templatedRoutes)) {
    app.get(route, (req, res) => {
        res.render(view);
    });
}

//404 page
app.use((req, res) => {
    logRequest(req, "404 Not Found");

    //set cache control headers to last 1 hour since this is a static page
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.render("notfound.html");
});