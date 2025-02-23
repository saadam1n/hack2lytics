from flask import Flask, request, Response, stream_with_context
import time
import os
import json

from assistant import generate_response, create_thread_id
from openai import Client
app = Flask(__name__)
with open("inference/api_key.txt", "r") as api:
    api_key = api.read()
    client = Client(api_key=api_key)

assistant = client.beta.assistants.create(
    name='Code Assistant Agent',
    instructions="As a top-tier web developement Cybersecurity AI, you are adept at analyzing potential vulnerabilities in API calls. You will analyze the Website Source Code file attached for exposure of sensitive data, security vulnerabilities, and compliance with best practices (e.g., OWASP, GDPR). Find all serious vulnerabilities and exploits while prioritizinge glaring issues. Do not hallucinate. List at most four key points and reccomendations and keep it concise.",
    model="gpt-4o-mini",
    tools=[{"type": "file_search"}]
)


@app.route("/create_thread", methods=["POST"])
def create_thread():
    id = create_thread_id(client)
    response_data = {"id": str(id)}
    return json.dumps(response_data), 200, {'Content-Type': 'text/json'}


@app.route('/message', methods=['POST'])
def message():
    # Get JSON data from the request
    data = request.get_json()
    session_id = data.get('session')
    user_prompt = data.get('prompt')
    user_file = data.get('file') if data else None
    user_file_ext = data.get('file_ext') if data else None
    user_request = data.get('request') if data else None

    if not user_prompt:
        return {"error": "No prompt provided"}, 400

    file_path = None
    if user_file:
        hash = str(time.time()).replace(".", "")
        file_path = f"/tmp/file{ hash }.{user_file_ext}"
        with open(file_path, "w") as f:
            f.write(user_file)

    request_path = None
    if user_request:
        hash = str(time.time()).replace(".", "")
        request_path = f"/tmp/file{ hash }-request.txt"
        with open(request_path, "w") as f:
            f.write(user_request)

    # Return a streaming response using the generator function
    print("Generating response")
    print("File path: ", file_path)
    print("Request path: ", request_path)
    response_text = generate_response(
        client, assistant.id, session_id, user_prompt, file_path, request_path)

    # wipe ass after taking a shit
    if user_file:
        os.remove(file_path)

    if user_request:
        os.remove(request_path)

    response_data = {"id": str(response_text)}
    return response_data, 200, {'Content-Type': 'text/plain'}


if __name__ == '__main__':
    app.run(debug=True)
