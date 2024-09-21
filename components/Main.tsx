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
  const [imageStack, setImageStack] = useState<(string | null)[]>([]);
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

    socket.on("undo", ({ lines, image }) => {
      setLines(lines);
      setImageSrc(image);
    });

    socket.on("redo", ({ lines, image }) => {
      setLines(lines);
      setImageSrc(image);
    });

    socket.on("addImage", ({ image }) => {
      setImageSrc(image);
    });

    socket.on("clearBoard", () => {
      setLines([]);
      setImageSrc(null); // Clear the image as well
    });

    return () => {
      socket.off("initCanvas");
      socket.off("drawing");
      socket.off("undo");
      socket.off("redo");
      socket.off("addImage");
      socket.off("clearBoard");
    };
  }, [socket]);

  const undo = () => {
    if (lines.length > 0 || imageSrc) {
      const lastLine = lines.pop();
      if (lastLine) setRedoStack([...redoStack, lastLine]);

      const lastImage = imageSrc ? imageSrc : imageStack.pop();
      if (lastImage) setImageStack([...imageStack, lastImage]);

      setLines([...lines]);
      setImageSrc(
        imageStack.length > 0 ? imageStack[imageStack.length - 1] : null
      );
      socket?.emit("undo", {
        roomId,
        lines,
        image: imageStack[imageStack.length - 1],
      });
    }
  };

  const redo = () => {
    const lastRedo = redoStack.pop();
    const lastImageRedo = imageStack.pop();

    if (lastRedo || lastImageRedo) {
      if (lastRedo) setLines([...lines, lastRedo]);
      if (lastImageRedo) setImageSrc(lastImageRedo);

      setRedoStack([...redoStack]);
      setImageStack([...imageStack]);
      socket?.emit("redo", { roomId, lines, image: lastImageRedo });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setImageStack([...imageStack, reader.result as string]); // Push image to stack
        socket?.emit("addImage", { roomId, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearBoard = () => {
    setLines([]);
    setImageSrc(null);
    socket?.emit("clearBoard", roomId);
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
          clearBoard={clearBoard}
          exportImage={exportImage}
        />
      </div>
    </div>
  );
};

export default Main;
