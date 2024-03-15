from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()

import json
import tornado.ioloop
import tornado.web
import tornado.websocket
import os
import signal

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.getenv("OPENAI_API_KEY"),
)


def exit_function(signum,frame):
    exit(0)

signal.signal(signal.SIGTERM,exit_function)
signal.signal(signal.SIGINT,exit_function)

path = os.path.join(os.path.dirname(__file__))

websockets = {}

agentBehavior = '''
Eres un agente virtual.
Tus respuestas deben ser cortas. No más de 3 oraciones de pocas palabras.
Has que tus respuestas rimen con el input del usuario.  
'''

def get_gpt_answer(messages):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",  
        messages = messages
    )
    return completion.choices[0].message.content
def process_message(data,websocket):
    print(data)
    if data["action"] == "registerID":
        websockets[data["id"]] = {"ws" : websocket, "chat_history":[{"role": "system", "content": agentBehavior}]}
    elif data["action"] == "answerChat":
        websockets[data["id"]]["chat_history"].append({"role":"user","content":data["message"]})
        response = get_gpt_answer(websockets[data["id"]]["chat_history"])
        websockets[data["id"]]["chat_history"].append({"role":"assistant","content":response})
        websocket.send_data({"action":"gpt_answer","message":response})
    else:
        print("no action")
class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print("Websocket abierto")
    
    def on_close(self):
        print("Websocket cerrado")

    def send_data(self,data):
        self.write_message(json.dumps(data))

    def on_message(self,message):
        try:
            data = json.loads(message)
            process_message(data,self)
        except TypeError:
            print("error al processar mensaje")

class StaticHandler(tornado.web.StaticFileHandler):
    def get_content_type(self):
        _, extension = tornado.web.os.path.splitext(self.absolute_path)
        
        mime_types = {
            ".js": "application/javascript",
            ".css": "text/css",
            ".html": "text/html",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".svg": "image/svg+xml"
        }
        
        return mime_types.get(extension, "text/plain")

TornadoSettings = static_handler_args={'debug':False}
application = tornado.web.Application([
    (r'/command', WebSocketHandler),
    (r'/(.*)',StaticHandler,{"path":os.path.join(path,"public\\"),"default_filename":"index.html"})
],**TornadoSettings)


if __name__ == '__main__':
    application.listen(80)
    tornado.ioloop.IOLoop.instance().start()