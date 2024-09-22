import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Line,
  Image as KonvaImage,
  Circle,
  Text,
} from "react-konva";
import { useTheme } from "next-themes";
import useImage from "use-image";
import { Socket } from "socket.io-client";
import Konva from "konva";

interface Point {
  x: number;
  y: number;
  tool: string;
  color: string;
  lineWidth: number;
}

interface Cursor {
  x: number;
  y: number;
  id: string;
  name: string;
}

interface LineData {
  points: Point[];
}

interface WhiteboardCanvasProps {
  tool: string;
  color: string;
  lineWidth: number;
  imageSrc: string | null;
  lines: LineData[];
  setLines: React.Dispatch<React.SetStateAction<LineData[]>>;
  socket: Socket | null;
  roomId: string;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  tool,
  color,
  lineWidth,
  imageSrc,
  lines,
  setLines,
  socket,
  roomId,
}) => {
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const stageRef = useRef<Konva.Stage | null>(null);
  const isDrawing = useRef(false);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setCurrentLine([{ ...pos, tool, color, lineWidth }]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();

    if (point && socket) {
      socket.emit("mouseMove", { roomId, x: point.x, y: point.y });
    }

    if (!isDrawing.current) return;

    if (point) {
      setCurrentLine((prev) => [...prev, { ...point, tool, color, lineWidth }]);
    }
  };

  const handleMouseUp = () => {
    if (currentLine.length > 0) {
      setLines((prev) => [...prev, { points: currentLine }]);
      socket?.emit("drawing", { roomId, line: { points: currentLine } });
      setCurrentLine([]);
    }
    isDrawing.current = false;
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("drawing", (data: { line: LineData }) => {
      setLines((prev) => [...prev, data.line]);
    });

    socket.on(
      "undo",
      ({ lines, image }: { lines: LineData[]; image: string | null }) => {
        setLines(lines);
        if (image) {
          const img = new Image();
          img.src = image;
          img.onload = () => setLoadedImage(img);
        } else {
          setLoadedImage(null);
        }
      }
    );

    socket.on(
      "redo",
      ({ lines, image }: { lines: LineData[]; image: string | null }) => {
        setLines(lines);
        if (image) {
          const img = new Image();
          img.src = image;
          img.onload = () => setLoadedImage(img);
        } else {
          setLoadedImage(null);
        }
      }
    );

    socket.on("addImage", ({ image }: { image: string }) => {
      const img = new Image();
      img.src = image;
      img.onload = () => setLoadedImage(img);
    });

    socket.on("clearBoard", () => {
      setLines([]);
      setLoadedImage(null);
    });

    socket.on("mouseUpdate", (data: Cursor) => {
      setCursors((prevCursors) => {
        const updatedCursors = prevCursors.filter((c) => c.id !== data.id);
        return [...updatedCursors, data];
      });
    });

    return () => {
      socket.off("drawing");
      socket.off("undo");
      socket.off("redo");
      socket.off("addImage");
      socket.off("clearBoard");
      socket.off("mouseUpdate");
    };
  }, [socket, setLines]);
  const { theme } = useTheme();
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={stageRef}
    >
      <Layer>
        {loadedImage && <KonvaImage image={loadedImage} x={0} y={0} />}
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points.flatMap((p) => [p.x, p.y])}
            stroke={line.points[0].color}
            strokeWidth={line.points[0].lineWidth}
            lineCap="round"
            globalCompositeOperation={
              line.points[0].tool === "eraser"
                ? "destination-out"
                : "source-over"
            }
          />
        ))}
        {currentLine.length > 0 && (
          <Line
            points={currentLine.flatMap((p) => [p.x, p.y])}
            stroke={currentLine[0].color}
            strokeWidth={currentLine[0].lineWidth}
            lineCap="round"
            globalCompositeOperation={
              currentLine[0].tool === "eraser"
                ? "destination-out"
                : "source-over"
            }
          />
        )}
        {cursors.map((cursor) => (
          <React.Fragment key={cursor.id}>
            <Circle x={cursor.x} y={cursor.y} radius={5} fill="red" />
            <Text
              x={cursor.x + 10}
              y={cursor.y - 10}
              fill={theme === "dark" ? "white" : "black"}
              text={cursor.name}
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
};

export default WhiteboardCanvas;
