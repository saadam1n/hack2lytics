# store api key in inference/api_key.txt

"""
args:
    session id: session id of the current thread (map from session id to thread)
    prompt: prompt given by user as string
    local_file_path: path to downloaded file as string on this machine if user provided file (otherwise it is None)
    request: network request as string if user provided file as file path on local machine(otherwise it is None)

    either local file path or request will be provided

return value:
    string of fully generated text
"""
import io
import os
from openai import AssistantEventHandler


class EventHandler(AssistantEventHandler):
    def on_text_created(self, text) -> None:
        string_buffer.write(f"\nassistant > ")

    def on_tool_call_created(self, tool_call):
        string_buffer.write("\nassistant > " + tool_call.type + "\n")

    def on_message_done(self, message) -> None:
        # print a citation to the file searched
        message_content = message.content[0].text
        string_buffer.write(message_content.value)


def generate_response(client, assistant_id, session_id, prompt, local_file_path, local_request_path):
    # replace pass with your own code
    global string_buffer
    string_buffer = io.StringIO()
    attachments_lst = []
    for file in [local_file_path, local_request_path]:
        if file:
            try:
                message_file = client.files.create(
                    file=open(file, "rb"), purpose="assistants")
                attachments_lst.append(
                    {"file_id": message_file.id, "tools": [{"type": "file_search"}]})
            except:
                print("Invalid file type")
                return -1
    print(attachments_lst)
    # Create a thread and attach the file to the message
    user_prompt = "Analyze this source code for any vulnerabilities"
    if prompt and prompt != ".":
        user_prompt = prompt
    client.beta.threads.messages.create(
        thread_id=session_id,
        role="user",
        content=user_prompt,
        attachments=attachments_lst)

    with client.beta.threads.runs.stream(
        thread_id=session_id,
        assistant_id=assistant_id,
        event_handler=EventHandler(),
        temperature=.8,
        max_prompt_tokens=130000,
        max_completion_tokens=20000
    ) as stream:
        stream.until_done()
    result = string_buffer.getvalue()
    return result


"""
Creates a new thread id and returns the OpenAI thread id
"""


def create_thread_id(client):
    current_directory = os.getcwd()
    message_file = client.files.create(
        file=open(os.path.join(current_directory, "Top-25-Most-Dangerous-Software-Weaknesses-1.pdf"), "rb"), purpose="assistants")

    # Create a thread and attach the file to the message

    return client.beta.threads.create(messages=[]).id
