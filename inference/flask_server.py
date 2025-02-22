from flask import Flask, request, Response, stream_with_context
import time

app = Flask(__name__)

def generate_response(user_message):
    """
    Simulate a streaming response by yielding parts of a message.
    In a real application, this function would process the input message
    and yield the output incrementally.
    """
    # Generate the response
    pass

@app.route('/message', methods=['POST'])
def message():
    # Get JSON data from the request
    data = request.get_json()
    user_message = data.get('message') if data else None

    if not user_message:
        return {"error": "No message provided"}, 400

    # Return a streaming response using the generator function
    response_text = generate_response(user_message)
    return response_text, 200, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    app.run(debug=True)