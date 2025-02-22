import dotenv from "dotenv";
dotenv.config();
//Check if all required environment variables are set and parse them as needed

//NODE_ENV is either "development" or "production"
if (!process.env.NODE_ENV) {
    console.error("NODE_ENV not set");
    process.exit(1);
}
else if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "production") {
    console.error("NODE_ENV must be either 'development' or 'production'");
    process.exit(1);
}


//PORT is a valid port number
if (!process.env.PORT) {
    console.error("PORT not set");
    process.exit(1);
}
const port = parseInt(process.env.PORT);
if (isNaN(port) || port < 1 || port > 65535) {
    console.error("PORT must be a valid port number");
    process.exit(1);
}

//CORS_ORIGIN is a string
if (!process.env.CORS_ORIGIN) {
    console.error("CORS_ORIGIN not set");
    process.exit(1);
}


export const config = {
    port,
};
