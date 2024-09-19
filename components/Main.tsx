import React, { useState } from "react";
import { io } from "socket.io-client";
import WhiteboardCanvas from "./Whiteboard";
import Toolbar from "./Toolbar";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://localhost:3001");

const Main: React.FC = () => {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [lines, setLines] = useState<any[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const undo = () => {
    const lastLine = lines.pop();
    if (lastLine) setRedoStack([...redoStack, lastLine]);
    setLines([...lines]);
    socket.emit("undo", lines);
  };

  const redo = () => {
    const lastRedo = redoStack.pop();
    if (lastRedo) setLines([...lines, lastRedo]);
    setRedoStack([...redoStack]);
    socket.emit("redo", lines);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        socket.emit("addImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-fluid">
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
      />
      <WhiteboardCanvas
        tool={tool}
        color={color}
        lineWidth={lineWidth}
        imageSrc={imageSrc}
        lines={lines}
        setLines={setLines}
        socket={socket}
      />
    </div>
  );
};

export default Main;
