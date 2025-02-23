import axios from "axios";

/**
 * Makes a new session and returns the session id
 * @returns {Promise<string>} The session id
 */
export async function makeNewSession(): Promise<string> {
    const response = await axios.post(process.env.BACKEND_URL + "/create_thread");
    return response.data.id;
}