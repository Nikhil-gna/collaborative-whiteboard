import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import dynamic from "next/dynamic";
import Header from "../components/Header";

interface User {
  id: string;
  name: string;
}

const Whiteboard = dynamic(() => import("../components/Main"), {
  ssr: false,
});

const Room = () => {
  const router = useRouter();
  const { roomId, name } = router.query; // Get roomId and name from query params
  const [users, setUsers] = useState<User[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (name && roomId) {
      socketRef.current = io("http://localhost:3001");
      const socket = socketRef.current;

      socket.emit("joinRoom", { roomId, name }); // Emit with the name and roomId

      socket.on("userJoined", (users: User[]) => {
        setUsers(users);
      });

      socket.on("userLeft", (updatedUsers: User[]) => {
        setUsers(updatedUsers);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [name, roomId]);

  if (!roomId || !name) return <div>Loading...</div>;

  return (
    <div className="room h-100 d-flex flex-column">
      <Header
        userName={name as string}
        profileImage="https://via.placeholder.com/40"
      />
      <div className="flex-grow-1 position-relative">
        <Whiteboard roomId={roomId as string} socket={socketRef.current} />
      </div>
      <div className="position-absolute top-20 end-10">
        <div className=" bg-gray-100 dark:bg-gray-900  rounded-lg shadow-lg p-2 text-gray-900 dark:text-white small">
          <b>Room Id:</b> {roomId} <br></br>
          <b>Active Users:</b> {users.length}
          <ul>
            {users.map((user) => (
              <li key={user.id}>• {user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Room;
