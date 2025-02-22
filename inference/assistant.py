# store api key in inference/api_key.txt

"""
args:
    session id: session id of the current thread (map from session id to thread)
    prompt: prompt given by user as string
    local_file_path: path to downloaded file as string on this machine if user provided file (otherwise it is None)
    request: network request as string if user provided file (otherwise it is None)

    either local file path or request will be provided

return value:
    string of fully generated text
"""


def generate_response(session_id, prompt, local_file_path, request):
    # replace pass with your own code
    print("Prompt:", prompt)
    return "hes"

"""
Creates a new thread id and returns the OpenAI thread id
"""
def create_thread_id():
    pass
