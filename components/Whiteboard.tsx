import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
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
  exportImage: () => void; // <-- Add exportImage to the props
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
  exportImage, // <-- Destructure exportImage here
}) => {
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const stageRef = useRef<Konva.Stage | null>(null);
  const isDrawing = useRef(false);
  const [loadedImage] = useImage(imageSrc || "");

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setCurrentLine([{ ...pos, tool, color, lineWidth }]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
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

    socket.on("addImage", (image: string) => {
      setCurrentLine([]);
    });

    socket.on("undo", (updatedLines: LineData[]) => {
      setLines(updatedLines);
    });

    socket.on("redo", (updatedLines: LineData[]) => {
      setLines(updatedLines);
    });

    return () => {
      socket.off("drawing");
      socket.off("addImage");
      socket.off("undo");
      socket.off("redo");
    };
  }, [socket, setLines]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      ref={stageRef}
    >
      <Layer>
        {loadedImage && <KonvaImage image={loadedImage} x={0} y={0} />}
        {lines?.map((line, i) => (
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
      </Layer>
    </Stage>
  );
};

export default WhiteboardCanvas;
