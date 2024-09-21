import { useState } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState(""); // Add name state
  const router = useRouter();

  const createRoom = () => {
    const id = Math.random().toString(36).substr(2, 9);
    router.push(`/${id}?name=${name}`); // Pass name as query param
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      router.push(`/${roomId}?name=${name}`); // Pass name as query param
    }
  };

  return (
    <div className="container text-center">
      <h1>Welcome to DigiBoard</h1>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <br />
      <button className="btn btn-primary" onClick={createRoom}>
        Create Room
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
