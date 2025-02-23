import axios from "axios";
import { CodeFile } from "../parsers/parseCodeFile";

/**
 * Sends a prompt to the backend and returns the response
 * @param {string} userid The user's session id
 * @param {string} prompt The prompt to send
 * @param {CodeFile} file The file to send
 * @param {string} web_request The web request to send
 * @returns {*}  {Promise<string>}
 */
export async function sendPrompt(userid: string, prompt: string, file: CodeFile | null, web_request: string): Promise<string> {
    const data: Record<string, string> = {
        session: userid,
        prompt: prompt,
        request: web_request
    };
    if (file !== null) {
        data['file'] = file.content.toString();
        data['file_ext'] = file.extension;
    }
    const response = await axios.post(process.env.BACKEND_URL + "/message", data);
    return response.data;
}