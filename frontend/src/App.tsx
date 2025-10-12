import { useState, useEffect, useRef} from "react";
import "./App.css";

function App() {
  const [socket , setSocket] = useState<WebSocket | null>(null);
  const [messages , setMessages] = useState<string[]>([]);
  const inputref = useRef(null);

  function sendmessage(){
    if(!socket) return;
    const message = inputref.current.value;
    if(message){
      socket.send(message);
      inputref.current.value = "";
    }
  }

  useEffect(()=>{
    if(socket) return;
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setSocket(ws);
    };
    ws.onmessage = (event) => {
      setMessages(prevMessages => [...prevMessages, event.data]);
    }
  },[socket])

  return(
    <main className="bg-gray-800 h-screen flex items-center justify-center">
      <div className="border-2 border-white w-1/2 h-2/3 mx-auto mt-15 p-10 rounded-3xl">
      <div className="text-2xl text-white font-bold text-center">Chat App</div>
        <div className="border-2 border-white w-150 h-88 mx-auto mt-5 p-5 flex flex-col justify-end rounded-3xl">
          {/* chat messages will go here */}
           <div className="border-2 border-white w-full h-5/6 mx-auto p-5 rounded-3xl overflow-y-scroll">
             {messages.map((message, index) => (
                <div key={index} className="text-white mb-2">
                  {message}
                </div>
             ))}
           </div>
           {/* input field and send button */}
            <div className="flex mt-5 space-x-2">
              <input type="text" 
              ref={inputref}
              className="text-white border-2 border-gray-300 p-2 w-full rounded-2xl"
              placeholder="Type your message here..."            
              />
              <button
                onClick={sendmessage}
                className="bg-slate-600 text-white p-2 rounded-2xl mt-2 hover:bg-slate-700">
                Send
              </button>
            </div>
        </div>
      </div>
    </main>
  )
}

export default App;