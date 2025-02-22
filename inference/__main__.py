from transformers import pipeline

print("Python script is running!")

# Example usage
with open("request.txt", "r") as f:
    request_to_analyze = f.read()

query = f"Analyze this network request for vulnerabilities and quality issues. Let's think step by step:\n{request_to_analyze}"

messages = [
    {"role": "user", "content": query},
]
pipe = pipeline("text-generation", model="ZySec-AI/SecurityLLM")
pipe(messages)

result = get_completion(query, model, tokenizer)
print(result)