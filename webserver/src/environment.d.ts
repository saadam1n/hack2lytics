export { };

// set types of process.env
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            PORT: string;
            CORS_ORIGIN: string;
            DB_CONNECT : string;
            BACKEND_URL : string;
        }
    }
}
