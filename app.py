from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)


client=OpenAI()

@app.route('/')
def index():
	return render_template("index.html")


@app.route('/api/query')
def get_completions():
	prompt = request.args.get('msg')
	reply = []
	completion = client.chat.completions.create(
		model="gpt-4o-mini",
		n=5,
		max_completion_tokens=20,
		messages=[
			{"role": "system", "content": "You are a storyteller who continues the lines and stories told to you. Your addition should be less than a sentence."},
			{"role": "user", "content": prompt}
		]
	)

	if completion:
		for choice in completion.choices:
			print(choice.message)
			reply.append(choice.message.content)
	else:
		reply.append("ERROR - No completions found")
		print("No response received")

	response = jsonify({'choices': reply})
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response