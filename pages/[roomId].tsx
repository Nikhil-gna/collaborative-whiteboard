import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import { Button, Form, Modal } from "react-bootstrap";

interface User {
  id: string;
  name: string;
}

const Whiteboard = dynamic(() => import("../components/Main"), {
  ssr: false,
});

const Room = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && typeof roomId === "string") {
      setShowModal(false);
      socketRef.current = io("http://localhost:3001"); // Connect to socket server
      const socket = socketRef.current;

      // Emit room joining event
      socket.emit("joinRoom", { roomId, name });

      // Handle user joining
      socket.on("userJoined", (users: User[]) => {
        setUsers(users);
      });

      // Handle user leaving
      socket.on("userLeft", (updatedUsers: User[]) => {
        setUsers(updatedUsers);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Cleanup socket connection on component unmount
      }
    };
  }, []);

  if (!roomId) return <div>Loading...</div>;

  return (
    <div className="room h-100 d-flex flex-column">
      <Header userName={name} profileImage="https://via.placeholder.com/40" />
      <Modal show={showModal} centered backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Join Whiteboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleJoinRoom}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Join Room
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {!showModal && (
        <>
          <div className="flex-grow-1 position-relative">
            <Whiteboard roomId={roomId as string} socket={socketRef.current} />
          </div>
          {/* <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3"> */}
          <div className="position-absolute top-20 end-10">
            <div className="bg-white rounded-lg shadow-lg p-2">
              Active Users: {users.length}
              <ul>
                {users.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Room;
