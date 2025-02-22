import { Request, Response } from "express";

/**
 * Generates a middleware that sets the cache time for a request
 * @param {number} time The time in seconds to cache the request
 * @returns {(req: Request, res: Response, next: () => void) => Promise<void>} The middleware function
 */
export function setCacheTime(time: number): (req: Request, res: Response, next: () => void) => Promise<void> {
    return async (req, res, next) => {
        res.set("Cache-Control", `public, max-age=${time}`);
        next();
    };
}