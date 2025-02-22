from flask import Flask, request, Response, stream_with_context
import time
import os

from assistant import generate_response, create_thread_id

app = Flask(__name__)

@app.route("/create_thread", methods="POST")
def create_thread():
    id = create_thread_id()
    return str(id), 200, {'Content-Type': 'text/plain'}


@app.route('/message', methods=['POST'])
def message():
    # Get JSON data from the request
    data = request.get_json()
    session_id = data.get('session') 
    user_prompt = data.get('prompt') 
    user_file = data.get('file') if data else None
    user_request = data.get('request') if data else None

    if not user_prompt:
        return {"error": "No prompt provided"}, 400

    if not user_file and not user_request:
        return {"error": "Neither file or request provided"}, 400

    file_path = None
    if user_file:
        hash = str(time.time()).replace(".", "")
        file_path = f"/tmp/file{ hash }.txt"
        with open(file_path, "w") as f:
            f.write(user_file)

    # Return a streaming response using the generator function
    response_text = generate_response(session_id, user_prompt, file_path, user_request)

    # wipe ass after taking a shit
    if user_file:
        os.remove(file_path)

    return response_text, 200, {'Content-Type': 'text/plain'}


if __name__ == '__main__':
    app.run(debug=True)
