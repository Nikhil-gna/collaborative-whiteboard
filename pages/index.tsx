import { useState } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const createRoom = () => {
    const id = Math.random().toString(36).substr(2, 9);
    router.push(`/${id}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      router.push(`/${roomId}`);
    }
  };

  return (
    <div className="container text-center">
      <h1>Welcome to DigiBoard</h1>
      <button className="btn btn-primary" onClick={createRoom}>
        Start Whiteboard
      </button>
      <hr />
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button className="btn btn-secondary" onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
};

export default Home;
