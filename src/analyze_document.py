from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import openai
import textract
import os
import magic
import re
import tiktoken
from dotenv import dotenv_values


app = Flask(__name__)
sockets = SocketIO(app)


env_vars = dotenv_values()
openai.api_key =env_vars['OPEN_AI_KEY_ID']


current_dir = os.getcwd()
data_path = os.path.abspath(os.path.join(current_dir, '../data'))
mime = magic.Magic(mime=True)


def num_tokens_from_messages(messages, model="gpt-3.5-turbo"):
  """Returns the number of tokens used by a list of messages."""
  try:
      encoding = tiktoken.encoding_for_model(model)
  except KeyError:
      encoding = tiktoken.get_encoding("cl100k_base")
  if model == "gpt-3.5-turbo":  # note: future models may deviate from this
      num_tokens = 0
      for message in messages:
          num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
          for key, value in message.items():
              num_tokens += len(encoding.encode(value))
              if key == "name":  # if there's a name, the role is omitted
                  num_tokens += -1  # role is always required and always 1 token
      num_tokens += 2  # every reply is primed with <im_start>assistant
      return num_tokens
  else:
      return 4150


def cut_pre_text(message, number_tokens ):
    if number_tokens > 3600:
        # print("====================--------start cutting -------------=====================")
        while  True:
            all_lines = message.splitlines()
            lines = all_lines[:-1]
            # print( all_lines[-1])
            new_msg = "\n".join(lines)
        
            number_tokens = num_tokens_from_messages([{"role": "user", "content": new_msg }])
            
            message = new_msg
           
            
            if number_tokens < 3550:
                print("====================--------End of cutting -------------=====================")
                print("--------------tokens final-------- ==> ", number_tokens)
                break     
        
        return  message 
        
    else:       
        return message






@app.route("/")
def index():
    return render_template("prct.html")






def remove_bullet_points(text):
    # Remove bullet points and replace with a newline character
    text = re.sub(r"\s*•\s*", "\n", text)
    # Remove any other bullet points that may occur
    text = re.sub(r"\s*[\u2022\u2023\u25E6\u2043]\s*", "\n", text)
    # Remove  and double dashes
    text = re.sub(r"[–]", "\n", text)
    return text


@app.route("/parse" , methods=['POST'])
def upload():    
    file = request.files['file']
    # print("=====", file)
    key = file.filename
    file_path = f"{data_path}/{key}"
    file.save(file_path)       
    
    if mime.from_file(file_path) == "application/pdf":
        try:
            text= textract.process(file_path)  
            text = str(text, "utf-8")                   
                
        except Exception as e:
            return f"Error reading PDF file:  {str(e)}" 
    
        
        
    else:
        print(f"File type not supported: {key}")
              
    clean_text = re.sub("\n+", "\n", text)
    # print(clean_text)
    number_tokens = num_tokens_from_messages([{"role": "user", "content": clean_text }])
    clean_text = cut_pre_text(clean_text, number_tokens)    
    return clean_text




@sockets.on('message')
def on_message(message):
    
 
    try:
        response = openai.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {'role': 'user', 'content': message} #message['message']
                ],
                temperature=1,
                stream=True
        )   
            


        for chunk in response:
            collected_messages = chunk['choices'][0]['delta']
            full_reply_content = ''.join(collected_messages.get('content', ''))
            emit('response', full_reply_content, broadcast=True)

        response.close()
    except openai.error.OpenAIError as e:
        error_message = f"reduce document size to 2 or 3 pages so this error will not come: {str(e)}"
        emit('response', error_message, broadcast=True)

    except Exception as e:
        error_message = f"Unknown error: {str(e)}"
        emit('response', error_message, broadcast=True)



if __name__ == '__main__':
    sockets.run(app, debug=False)
