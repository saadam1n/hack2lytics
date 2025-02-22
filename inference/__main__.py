from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Llama-8B")
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Llama-8B")

print("Python script is running!")

# Example usage
with open("request.txt", "r") as f:
    request_to_analyze = f.read()

query = f"Analyze this network request for vulnerabilities and quality issues. Let's think step by step:\n{request_to_analyze}"

messages = [
    {"role": "user", "content": query},
]

inputs = tokenizer(query, return_tensors='pt')
output = model.generate(**inputs, max_new_tokens=128)
response = tokenizer.decode(output[0], skip_special_tokens=True)

print("Finished")
print(response)