import { useState } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false); // State to toggle between creating and joining a room
  const router = useRouter();

  const createRoom = () => {
    const id = Math.random().toString(36).substr(2, 9);
    router.push(`/${id}?name=${name}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      router.push(`/${roomId}?name=${name}`);
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

          {!isJoining ? (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary btn-lg mr-2"
                onClick={createRoom}
                disabled={!name}
              >
                Create Room
              </button>
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => setIsJoining(true)}
                disabled={!name}
              >
                Join Room
              </button>
            </div>
          ) : (
            <>
              <div className="form-group mt-4">
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
                  disabled={!roomId}
                >
                  Join Room
                </button>
                <button
                  className="btn btn-secondary btn-lg ml-2"
                  onClick={() => setIsJoining(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
