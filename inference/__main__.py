from transformers import pipeline

print("Python script is running!")

# Example usage
with open("request.txt", "r") as f:
    request_to_analyze = f.read()

query = f"Analyze this network request for vulnerabilities and quality issues. Let's think step by step:\n{request_to_analyze}"

messages = [
    {"role": "user", "content": query},
]
# Use a pipeline as a high-level helper
from transformers import pipeline

messages = [
    {"role": "user", "content": "Who are you?"},
]
pipe = pipeline("text-generation", model="deepseek-ai/DeepSeek-R1-Distill-Llama-8B ", trust_remote_code=True)

result = pipe(messages)
print(result)