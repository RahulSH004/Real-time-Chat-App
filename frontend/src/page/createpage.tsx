import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePage(){
    const [roomCode, setRoomCode] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handlecreateroom = () => {
        if(!username.trim()) {
            alert("Please enter a username");
            return;
        }
        navigate("/chat", 
            {state: {
                action: "create",
                userName: username.trim()
            }}
        );
        console.log(username);
        console.log(roomCode);
    }
    const handleJoinRoom = () => {
        if(!username.trim()) {
            alert("Please enter a username");
            return;
        }
        navigate("/chat", 
            {state: {
                action: "join",
                userName: username.trim(),
                roomId: roomCode.trim()
            }}
        );
    }
    return (
        <main className="bg-gray-800 h-screen flex items-center justify-center">
      <div className="border-2 border-white w-96 p-10 rounded-3xl">
        <div className="text-3xl text-white font-bold text-center mb-8">
          Welcome to Chat App
        </div>
        
        {/* User Name Input */}
        <div className="mb-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-2xl border-2 border-gray-300 text-white"
            placeholder="Enter your name..."
          />
        </div>

        {/* Room Code Input */}
        <div className="mb-6">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full p-3 rounded-2xl border-2 border-gray-300 text-white"
            placeholder="Enter room code to join..."
          />
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={handlecreateroom}
            className="w-full bg-blue-600 text-white p-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Create New Room
          </button>
          
          <button
            onClick={handleJoinRoom}
            className="w-full bg-green-600 text-white p-3 rounded-2xl font-semibold hover:bg-green-700 transition-colors"
          >
            Join Room
          </button>
        </div>
      </div>
    </main>
    )
}
export default CreatePage;