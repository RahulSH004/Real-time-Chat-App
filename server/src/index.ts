import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let usercount = 0;
let allsockets: WebSocket[] = [];

wss.on("connection", function(socket){
    allsockets.push(socket);
    usercount = usercount + 1;
    console.log("A new client connected!"+ usercount);
    socket.on("message", (message) => {
        console.log("Received message:", message.toString());
        for(let i = 0 ; i < allsockets.length; i++){
            allsockets[i]?.send(`${message.toString()}`);
        }
    })
    socket.on("disconnect", ()=>{
        allsockets = allsockets.filter(s => s !== socket);
    })
})