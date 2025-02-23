import { ready } from '../util/ready';
import axios from 'axios';
import { marked } from 'marked';

let modal_open = false;

let sessionid: string | null = null;

let textField: HTMLDivElement | null = null;
let sendButton: HTMLButtonElement | null = null;
let uploadButton: HTMLButtonElement | null = null;
let fileInputCode: HTMLInputElement | null = null;
let fileInputLogs: HTMLInputElement | null = null;
let modal: HTMLDivElement | null = null;
let modalClose: HTMLButtonElement | null = null;
let chatDiv: HTMLDivElement | null = null;
let attachedIndicator: HTMLParagraphElement | null = null;


const INITIAL_PROMPT = `\n\n# Using the AI Assistant\n\n- **Engage and Upload**: Start with a greeting and upload relevant files (code or logs) for analysis. \n\n- **Ask Specific Questions**: Clearly identify what you need, e.g., *\"What vulnerabilities are in this code?\"*\n\n- **Review and Implement**: Check the AI's findings and apply the recommendations to enhance your security.\n\nLet me know if you need anything else!`;

ready(async () => {
    const sessionid_response = await axios.get("/api/createSession");
    sessionid = sessionid_response.data.id;

    textField = document.getElementById("text-entry") as HTMLDivElement;
    sendButton = document.getElementById("send-button") as HTMLButtonElement;
    uploadButton = document.getElementById("attach-button") as HTMLButtonElement;
    fileInputCode = document.getElementById("file-upload-code") as HTMLInputElement;
    fileInputLogs = document.getElementById("file-upload-logs") as HTMLInputElement;
    modal = document.getElementById("modal") as HTMLDivElement;
    modalClose = document.getElementById("modal-close") as HTMLButtonElement;
    chatDiv = document.getElementById("chatlog") as HTMLDivElement;
    attachedIndicator = document.getElementById("attached-list") as HTMLParagraphElement;

    //clear the text field
    if (textField) textField.innerText = "";

    //clear the file input
    if (fileInputCode) fileInputCode.value = "";
    if (fileInputLogs) fileInputLogs.value = "";

    await createChatMessage(false, INITIAL_PROMPT, false, true);

    fileInputLogs?.addEventListener("change", () => {
        if (attachedIndicator)
            attachedIndicator.innerText = attachedIndicator?.innerText + " +" + fileInputLogs?.files?.[0]?.name;
    });

    fileInputCode?.addEventListener("change", () => {
        if (attachedIndicator)
            attachedIndicator.innerText = attachedIndicator?.innerText + " +" + fileInputCode?.files?.[0]?.name;
    });


    uploadButton.onclick = (): void => {
        if (modal_open) {
            modal?.setAttribute("style", "display: none;");
            modal_open = false;
            return;
        }
        modal?.setAttribute("style", "display: block;");
        modal_open = true;
    };

    modalClose.onclick = (): void => {
        modal?.setAttribute("style", "display: none;");
        modal_open = false;
    };

    window.onclick = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (!target) return;
        if (target != uploadButton && target.closest("#modal") != modal) {
            modal?.setAttribute("style", "display: none;");
            modal_open = false;
        }
    };

    sendButton.onclick = async (): Promise<void> => {
        process();
    };

    textField?.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            process();
        }
    });


});


/**
 * process
 * @returns {*}  {Promise<void>}
 */
async function process(): Promise<void> {
    const request_logs = await prepareHAR();
    const codeFile = fileInputCode?.files?.[0];
    const prompt = textField?.innerText ?? "<no prompt>";

    const hasFile = codeFile != null || request_logs != "";
    await createChatMessage(true, prompt, hasFile);

    //clear the text field
    if (textField) textField.innerHTML = "";

    //clear the file input
    if (fileInputCode) fileInputCode.value = "";
    if (fileInputLogs) fileInputLogs.value = "";

    if (attachedIndicator) attachedIndicator.innerText = "";


    const elem = await createChatMessage(false, "Loading...", false, true);

    const reply = await sendMessage(sessionid ?? "", codeFile, prompt, request_logs);

    await editChatMessage(elem, reply, false, true);



    //scroll to the bottom
    chatDiv?.scrollTo({
        top: chatDiv.scrollHeight,
        behavior: "smooth",
    });
}


/**
 * sendChatMessage 
 * @param {boolean} isHuman isHuman
 * @param {string} message message
 * @param {boolean} hasFile hasFile
 * @param {boolean} as_md parse as markdown
 * @returns {*}
 */
async function createChatMessage(isHuman: boolean, message: string, hasFile: boolean, as_md = false): Promise<HTMLDivElement> {
    if (message == "") {
        message = "(No prompt)";
    }

    const chatMessage = document.createElement("div");
    chatMessage.classList.add(isHuman ? "user-msg" : "bot-msg");

    await editChatMessage(chatMessage, message, hasFile, as_md);

    chatDiv?.appendChild(chatMessage);

    return chatMessage;
}


/**
 * editChatMessage
 * @param {HTMLElement} elem elem
 * @param {boolean} isHuman isHuman
 * @param {string} message message
 * @param {boolean} hasFile hasFile
 * @param {boolean} as_md parse as markdown
 */
async function editChatMessage(elem: HTMLElement, message: string, hasFile: boolean, as_md = false): Promise<void> {
    elem.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.classList.add("msg-wrapper");

    const chatMessageText = document.createElement("span");
    if (as_md) {
        message.replaceAll("\n", "<br>");
        chatMessageText.innerHTML = await marked.parse(message);
    } else {
        chatMessageText.innerText = message;
    }
    wrapper.appendChild(chatMessageText);

    if (hasFile) {
        const chatMessageFile = document.createElement("p");
        chatMessageFile.classList.add("file-attachment");
        chatMessageFile.innerText = "+ Attached Files";
        wrapper.appendChild(chatMessageFile);
    }

    elem.appendChild(wrapper);
}

/**
 * Pre-processes the HAR file
 * @returns {*}  {Promise<string>}
 */
async function prepareHAR(): Promise<string> {
    //load the file provided by the user
    const file = fileInputLogs?.files?.[0];
    if (!file) {
        console.log("No HAR file provided");
        return "";
    }

    const reader = new FileReader();
    reader.readAsText(file);
    let content = "";
    await new Promise((resolve) => {
        reader.onload = (): void => {
            content = reader.result as string;
            resolve(null);
        };
    });
    const parsed = JSON.parse(content);
    let entries = parsed.log.entries;

    const okEntries: string[] = [];

    //cap entries to 100 for now
    entries = entries.slice(0, 100);

    for (const entry of entries) {
        const response = entry.response;

        let content_type = "";
        for (const header of response.headers) {
            const name = header.name.toString();
            if (name.toLowerCase() == "content-type") {
                content_type = header.value;
                break;
            }
        }
        if (content_type.includes("application/json")) {
            let str = "REQUESTSTART\n";
            str += "REQUESTURL\n";
            str += entry.request.url + "\n";
            str += entry.request.method + "\n";

            if (entry?.request?.postData?.text) {
                str += "REQUEST SAMPLE\n";
                str += entry.request.postData.text.slice(0, 1000) + "\n";
            }

            if (entry?.response?.content?.text) {
                str += "RESPONSE SAMPLE\n";
                str += entry.response.content.text.slice(0, 1000) + "\n";
            }

            okEntries.push(str);
        }
    }

    return okEntries.join("\n");
}

/**
 * sendMessage
 * @param {string} sessionid sessionid
 * @param {File} file file
 * @param {string} prompt prompt
 * @param {string} request request
 * @returns {*} 
 */
async function sendMessage(sessionid: string, file: File | undefined, prompt: string, request: string): Promise<string> {
    const formData = new FormData();
    formData.append("sessionid", sessionid);
    if (file)
        formData.append("file", file);
    formData.append("prompt", prompt + ".");
    formData.append("web_request", request);

    const resp = await axios.post("/api/sendMessage", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return resp.data.id;
}