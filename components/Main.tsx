import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import WhiteboardCanvas from "./Whiteboard";
import Toolbar from "./Toolbar";
import "bootstrap/dist/css/bootstrap.min.css";

interface MainProps {
  roomId: string;
  socket: Socket | null;
}

const Main: React.FC<MainProps> = ({ roomId, socket }) => {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [lines, setLines] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Initialize canvas with existing lines and image
    socket.on("initCanvas", ({ lines, image }) => {
      setLines(lines);
      setImageSrc(image);
    });

    socket.on("drawing", ({ line }) => {
      setLines((prevLines) => [...prevLines, line]);
    });

    socket.on("undo", ({ lines }) => {
      setLines(lines);
    });

    socket.on("redo", ({ lines }) => {
      setLines(lines);
    });

    socket.on("addImage", ({ image }) => {
      setImageSrc(image);
    });

    return () => {
      socket.off("initCanvas");
      socket.off("drawing");
      socket.off("undo");
      socket.off("redo");
      socket.off("addImage");
    };
  }, [socket]);

  const undo = () => {
    const lastLine = lines.pop();
    if (lastLine) setRedoStack([...redoStack, lastLine]);
    setLines([...lines]);
    socket?.emit("undo", { roomId, lines });
  };

  const redo = () => {
    const lastRedo = redoStack.pop();
    if (lastRedo) setLines([...lines, lastRedo]);
    setRedoStack([...redoStack]);
    socket?.emit("redo", { roomId, lines });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        socket?.emit("addImage", { roomId, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportImage = () => {
    const whiteboardCanvas = document.querySelector("canvas");
    if (whiteboardCanvas) {
      const link = document.createElement("a");
      link.href = whiteboardCanvas.toDataURL("image/png");
      link.download = "whiteboard.png";
      link.click();
    }
  };

  return (
    <div className="position-relative h-100">
      <WhiteboardCanvas
        tool={tool}
        color={color}
        lineWidth={lineWidth}
        imageSrc={imageSrc}
        lines={lines}
        setLines={setLines}
        socket={socket}
        roomId={roomId}
        exportImage={exportImage}
      />
      <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          handleImageUpload={handleImageUpload}
          undo={undo}
          redo={redo}
          exportImage={exportImage}
        />
      </div>
    </div>
  );
};

export default Main;
