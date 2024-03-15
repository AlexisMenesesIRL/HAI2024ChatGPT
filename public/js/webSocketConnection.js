const connection = new WebSocket("ws://localhost/command")
let callback = data => console.log(data)
let id;
connection.onopen = () =>{
    id = Math.random().toString(16).slice(2);
    connection.send(JSON.stringify({id,action:"registerID"}))
}

connection.onmessage = (e) =>{
    callback(e.data);
}

connection.onclose = (e)=>{
    console.log("websocket cerrado ", e)

}
export const set_websocket_message_processing_function = ( process_function ) =>{
    callback = process_function;
}

export const send  = (data) =>{
    data.id = id;
    connection.send(JSON.stringify(data))
}
 
export default connection;

