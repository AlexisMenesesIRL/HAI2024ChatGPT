import json
import tornado.ioloop
import tornado.web
import tornado.websocket
import os
import signal

def signint_received(signum,frame):
    exit(0)

signal.signal(signal.SIGTERM,signint_received)
signal.signal(signal.SIGINT,signint_received)

path = os.getcwd()



class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print("Websocket abierto")
    
    def on_close(self):
        print("Websocket cerrado")

    def send_data(self,data):
        self.write_message(json.dumps(data))


    def on_message(self,message):
        print(message)

print(os.path.join(path,'public'))
TornadoSettings = static_handler_args={'debug':False}
application = tornado.web.Application([
    #(r'/command', WebSocketHandler),
    (r'/*.',tornado.web.StaticFileHandler,{"path":os.path.join(path,"public\\"),"default_filename":"index.html"})
],**TornadoSettings)


if __name__ == '__main__':
    application.listen(80)
    tornado.ioloop.IOLoop.instance().start()