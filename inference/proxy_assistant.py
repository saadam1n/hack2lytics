from openai import OpenAI
client = OpenAI()

assistant = client.beta.assistants.create(
  instructions="You are an expert website security bot. Use the provided functions to analyze suspcious network request and vulnerabilityi is source code.",
  model="gpt-4o",
  tools=[
    {
      "type": "function",
      "function": {
        "name": "analyze_file",
        "description": "Read a file from the website's source code and use an expert code analyzer bot to find vulnerabilities in the source code.",
        "parameters": {
          "type": "object",
          "properties": {
            "file_name": {
              "type": "string",
              "description": "Path to the file to be read."
            }
          },
          "required": ["file_name"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "analyze_network_traffic",
        "description": "Use an expert web request bot to analyze web requests for suspcious activity and detect vulnerabities.",
        "parameters": {
          "type": "object",
          "properties": {
            "request": {
              "type": "string",
              "description": "The request to analyze"
            }
          },
          "required": ["request"]
        }
      }
    }
  ]
)


thread = client.beta.threads.create()
message = client.beta.threads.messages.create(
  thread_id=thread.id,
  role="user",
  content="Placeholder",
)

from typing_extensions import override
from openai import AssistantEventHandler
 
class EventHandler(AssistantEventHandler):
    @override
    def on_event(self, event):
      # Retrieve events that are denoted with 'requires_action'
      # since these will have our tool_calls
      if event.event == 'thread.run.requires_action':
        run_id = event.data.id  # Retrieve the run ID from the event data
        self.handle_requires_action(event.data, run_id)
 
    def handle_requires_action(self, data, run_id):
      tool_outputs = []
        
      for tool in data.required_action.submit_tool_outputs.tool_calls:
        if tool.function.name == "analyze_file":
          tool_outputs.append({"tool_call_id": tool.id, "output": "57"})
        elif tool.function.name == "analyze_network_traffic":
          tool_outputs.append({"tool_call_id": tool.id, "output": "0.06"})
        
      # Submit all tool_outputs at the same time
      self.submit_tool_outputs(tool_outputs, run_id)
 
    def submit_tool_outputs(self, tool_outputs, run_id):
      # Use the submit_tool_outputs_stream helper
      with client.beta.threads.runs.submit_tool_outputs_stream(
        thread_id=self.current_run.thread_id,
        run_id=self.current_run.id,
        tool_outputs=tool_outputs,
        event_handler=EventHandler(),
      ) as stream:
        for text in stream.text_deltas:
          print(text, end="", flush=True)
        print()
 
 
with client.beta.threads.runs.stream(
  thread_id=thread.id,
  assistant_id=assistant.id,
  event_handler=EventHandler()
) as stream:
  stream.until_done()