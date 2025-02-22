from flask import Flask, request, Response, stream_with_context
import time

from inference.assistant import generate_response

app = Flask(__name__)

next_file_idx = 0

@app.route('/message', methods=['POST'])
def message():
    # Get JSON data from the request
    data = request.get_json()
    user_prompt = data.get('prompt') if data else None
    user_file = data.get('file') if data else None
    user_request = data.get('request') if data else None

    if not user_prompt:
        return {"error": "No prompt provided"}, 400

    if not user_file and not user_request:
        return {"error": "Neither file or request provided"}, 400

    file_path = None
    if user_file:
        file_path = f"/tmp/file{next_file_idx}"
        with open(file_path, "w") as f:
            f.write(user_file)
            next_file_idx += 1

    # Return a streaming response using the generator function
    response_text = generate_response(user_prompt, file_path, user_request)
    return response_text, 200, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    app.run(debug=True)