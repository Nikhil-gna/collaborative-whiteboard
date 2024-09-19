import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

interface ToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  undo: () => void;
  redo: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  handleImageUpload,
  undo,
  redo,
}) => {
  return (
    <div className="toolbar">
      <ButtonGroup>
        <Button
          variant={tool === "pen" ? "primary" : "outline-primary"}
          onClick={() => setTool("pen")}
        >
          Pen
        </Button>
        <Button
          variant={tool === "eraser" ? "primary" : "outline-primary"}
          onClick={() => setTool("eraser")}
        >
          Eraser
        </Button>
        <Button
          variant={tool === "brush" ? "primary" : "outline-primary"}
          onClick={() => setTool("brush")}
        >
          Brush
        </Button>
      </ButtonGroup>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        type="range"
        min="1"
        max="50"
        value={lineWidth}
        onChange={(e) => setLineWidth(Number(e.target.value))}
      />

      <Button variant="success" onClick={undo}>
        Undo
      </Button>
      <Button variant="info" onClick={redo}>
        Redo
      </Button>

      <input
        type="file"
        onChange={handleImageUpload}
        className="form-control-file"
      />
    </div>
  );
};

export default Toolbar;
