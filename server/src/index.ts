import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allsockets: User[] = [];

wss.on("connection", function(socket){
    socket.on("message", (message) => {
        const data = JSON.parse(message as unknown as string);
        if(data.type === "join") {
            console.log("User joined room: " + data.payload.roomId);
            allsockets.push({ 
                socket: socket, 
                room: data.payload.roomId 
            });
        }

        if(data.type == "chat"){
            console.log("Message received: " + data.payload.message);
            //const user = allsockets.find(u => u.socket === socket);
            let currentuserRoom = null;
            for(let i = 0; i < allsockets.length; i++){
                if(allsockets[i]?.socket === socket){
                    currentuserRoom = allsockets[i]?.room;
                }
            }
            for(let i = 0; i < allsockets.length; i++){
                if(allsockets[i]?.room === currentuserRoom){
                    allsockets[i]?.socket.send(data.payload.message);
                }
            }
        }
    })
})