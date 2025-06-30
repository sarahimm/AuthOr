import torch
from transformers import pipeline

pipeline = pipeline(task="text-generation", model="Qwen/Qwen2.5-14B-Instruct", torch_dtype=torch.bfloat16, device=0)

adjs = ["skilled","robotic","impartial","poetic","automatic","creative","stochastic","generative"]
labels = ["poet","writing assistant","reporter","parrot","storyteller","grammatizer","ghostwriter","autocomplete systemS"]
prompts = ["Once upon a time, there lived a ","People who live in glass houses ","When I arrived at the office today, I never expected to see "]
maxTokens = 6
options = 3
temp = .9

for adj in adjs:
    for label in labels:
        for prompt in prompts:
            print(adj + " " + label + ": " )
            chat = [
                {"role": "system",
                 "content": "You are a" + adj + " " + label + ". Continue the sentence or line you are given by providing a creative next word or phrase.",},
                {"role": "user", "content": prompt}
            ]
            response = pipeline(chat, max_new_tokens=maxTokens,return_full_text=False, num_return_sequences=options, do_sample=True, temperature=temp)
            for option in response:
                print(option)

