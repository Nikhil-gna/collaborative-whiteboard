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
    <div className="container-fluid vh-100">
      <div className="row h-100 align-items-center justify-content-center">
        <div className="col-md-6 bg-white rounded p-5 shadow-lg">
          <h1 className="display-4 text-center mb-4 text-primary">
            Welcome to Whiteboard
          </h1>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control input-lg mb-3"
            />
          </div>
          <div className="d-flex justify-content-center mb-4">
            <button
              className="btn btn-primary btn-lg mr-2"
              onClick={createRoom}
            >
              Create Room
            </button>
          </div>

          <hr className="my-4 bg-light" />

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="form-control input-lg"
            />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary btn-lg"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
