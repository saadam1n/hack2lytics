from openai import OpenAI
client = OpenAI(api_key = "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")
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a cybersecurity expert specializing in web development and security. Analyze the following request for exposure of sensitive data, security vulnerabilities, and compliance with best practices (e.g., OWASP, GDPR). Provide recommendations for improving security."},
        {"role": "user", "content": """
         REQUEST
{"query":"query ListEvents($filter: ModelEventFilterInput, $limit: Int, $nextToken: String) {\n  listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {\n    items {\n      id\n      name\n      description\n      status\n      requireRSVP\n      canRSVP\n      start\n      end\n      location\n      points\n      checkInCode\n      createdAt\n      updatedAt\n      _version\n      _deleted\n      _lastChangedAt\n      __typename\n    }\n    nextToken\n    startedAt\n    __typename\n  }\n}\n","variables":{"filter":{"_deleted":{"ne":true}},"limit":1000}}

RESPONSE
{"data":{"listEvents":{"items":[{"id":"09d73bcd-6ef0-4a17-ad86-c4f100384ae2","name":"Sunday Breakfast","description":"Blue Donkey Coffee and Bagels","status":false,"requireRSVP":false,"canRSVP":false,"start":"2025-02-23T14:30:00.000Z","end":"2025-02-23T15:30:00.000Z","location":"Klaus 1116W","points":0,"checkInCode":"Bagul","createdAt":"2025-02-20T20:36:35.504Z","updatedAt":"2025-02-21T04:06:32.338Z","_version":2,"_deleted":null,"_lastChangedAt":1740110792378,"__typename":"Event"},{"id":"a583ccdb-16d6-47dc-b4dd-51c8f12dd3ae","name":"Saturday Lunch","description":"Moes Burritos\n** ALL ITEMS CONTAIN GLUTEN**","status":false,"requireRSVP":false,"canRSVP":false,"start":"2025-02-22T18:00:00.000Z","end":"2025-02-22T19:00:00.000Z","location":"Klaus 1116W","points":0,"checkInCode":"lonch","createdAt":"2025-02-20T20:19:47.857Z","updatedAt":"2025-02-21T04:04:28.124Z","_version":4,"_deleted":null,"_lastChangedAt":1740110668170,"__typename":"Event"},{"id":"f6f5d6bb-9c35-4f58-9e51-67c3033b2ae2","name":"Sponsor Fair","description":"ChitChat!","status":false,"requireRSVP":false,"canRSVP":false,"start":"2025-02-22T00:15:00.000Z","end":"2025-02-22T01:15:00.000Z","location":"Klaus Atrium","points":0,"checkInCode":"vibes","createdAt":"2025-02-20T02:25:49.629Z","updatedAt":"2025-02-20T02:29:20.894Z","_version":3,"_deleted":null,"_lastChangedAt":1740018560942,"__typename":"Event"}
    """}
    ]
)

print(response.choices[0].message.content)
