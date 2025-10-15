import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css"

export default function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const { action, roomId: joinRoomId, userName: passedUserName } = useLocation().state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!action || !passedUserName) {
      navigate("/");
      return;
    }

    setUserName(passedUserName);

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      const payload = { userId: passedUserName };
      if (action === "create") {
        ws.send(JSON.stringify({ type: "create", payload }));
      } else if (action === "join" && joinRoomId) {
        ws.send(JSON.stringify({ type: "join", payload: { ...payload, roomId: joinRoomId } }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "roomCreated":
        case "joinedRoom":
          setRoomId(data.roomId);
          setMessages(prev => [...prev, { type: "system", message: data.message }]);
          break;

        case "message":
          setMessages(prev => [...prev, data]);
          break;

        case "userJoined":
        case "userLeft":
          setMessages(prev => [...prev, { type: "system", message: data.message }]);
          break;

        case "error":
          alert(data.message);
          break;
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [action, joinRoomId, passedUserName, navigate]);

  const sendMessage = () => {
    if (socket && inputRef.current?.value.trim()) {
      socket.send(JSON.stringify({
        type: "chat",
        payload: { message: inputRef.current.value.trim() }
      }));
      inputRef.current.value = "";
    }
  };

  const leaveRoom = () => {
    socket?.send(JSON.stringify({ type: "leave" }));
    socket?.close();
    navigate("/");
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-lg w-full bg-gray-900 p-4 rounded-2xl flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-3">
          <h1 className="font-bold text-xl">Chat</h1>
          <button onClick={leaveRoom} className="bg-red-600 px-3 py-1 rounded">Leave</button>
        </div>

        {roomId && (
          <div className="bg-gray-700 p-2 rounded mb-3 text-center">
            <div className="text-sm">Room ID:</div>
            <div className="font-mono">{roomId}</div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto mb-3 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                msg.type === "system"
                  ? "bg-gray-600 text-center text-sm"
                  : msg.userId === userName
                    ? "bg-blue-600 ml-auto max-w-[80%]"
                    : "bg-gray-500 mr-auto max-w-[80%]"
              }`}
            >
              {msg.type === "message" && msg.userId !== userName && (
                <div className="text-xs opacity-70 mb-1">{msg.userId}</div>
              )}
              <div>{msg.message}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 p-2 rounded"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-blue-600 px-4 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
