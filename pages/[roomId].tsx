import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
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

const Room: React.FC = () => {
  const router = useRouter();
  const { roomId, name } = router.query;
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof roomId === "string" && typeof name === "string") {
      try {
        socketRef.current = io("http://localhost:3001");
        const socket = socketRef.current;

        socket.emit("joinRoom", { roomId, name });

        socket.on("userJoined", (updatedUsers: User[]) => {
          setUsers(updatedUsers);
        });

        socket.on("userLeft", (updatedUsers: User[]) => {
          setUsers(updatedUsers);
        });

        socket.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
          setError("Failed to connect to the server. Please try again.");
        });

        return () => {
          socket.disconnect();
        };
      } catch (err) {
        console.error("Error setting up socket connection:", err);
        setError("An error occurred while setting up the connection.");
      }
    }
  }, [roomId, name]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!roomId || !name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="room h-screen flex flex-col">
      <Header
        userName={name as string}
        profileImage="https://via.placeholder.com/40"
      />
      <div className="flex-grow relative">
        {socketRef.current && (
          <Whiteboard roomId={roomId as string} socket={socketRef.current} />
        )}

        {/* User List Panel */}
        <div
          className={`absolute top-24 right-10 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md border border-gray-200
                     transition-all duration-300 ease-in-out 
                     ${
                       showUsers
                         ? "opacity-100"
                         : "opacity-0 pointer-events-none"
                     }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Room: <span className="text-blue-500">{roomId}</span>
            </h3>
            <span className="px-2 py-1 mb-2 ms-2 bg-green-500 text-gray-900 dark:text-white rounded-full text-xs font-semibold">
              Live
            </span>
          </div>
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-900 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="ml-2 mb-0 text-gray-900 dark:text-white">
              Active Users: {users.length}
            </p>
          </div>
          <ul className="space-y-1">
            {users.map((user) => (
              <li key={user.id} className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="absolute top-20 right-10 p-2 rounded-full bg-gray-200 
                     hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showUsers ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Room;
