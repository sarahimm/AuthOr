from flask import Flask, render_template, request, jsonify
from transformers import pipeline

app = Flask(__name__)

pipeline = pipeline(task="text-generation", model="allenai/OLMo-2-0425-1B-Instruct")

@app.route('/')
def index():
	return render_template("index.html")

@app.route('/api/query')
def get_completions():
	prompt = request.args.get('msg')
	maxTokens = int(request.args.get('numTokens'))
	options = int(request.args.get('numOptions'))
	temp = float(request.args.get('temp'))
	sysPrompt = request.args.get('sysPrompt')
	reply = []
	chat = [
		{"role":"system",
   		 "content": sysPrompt},
		{"role": "user", "content": prompt}
	]
	completion = pipeline(chat, 
					   max_new_tokens=maxTokens, 
					   return_full_text=False, 
					   num_return_sequences=options, 
					   do_sample=True, 
					   temperature=temp)

	if completion:
		for choice in completion:
			reply.append(choice['generated_text'])
	else:
		reply.append("ERROR - No completions found")
		print("No response received")

	response = jsonify({'choices': reply})
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response

'''
OPENAI API version--TESTING ONLY!
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
	maxTokens = int(request.args.get('numTokens'))
	options = int(request.args.get('numOptions'))
	temp = float(request.args.get('temp'))
	sysPrompt = request.args.get('sysPrompt')
	reply = []
	completion = client.chat.completions.create(
		model="gpt-4o-mini",
		n=options,
		temperature=temp,
		max_completion_tokens=maxTokens,
		messages=[
			{"role": "system", "content": sysPrompt},
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
    '''