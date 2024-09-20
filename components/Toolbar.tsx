import React from "react";
import {
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
  Form,
} from "react-bootstrap";
import {
  FaPen,
  FaEraser,
  FaPaintBrush,
  FaUndo,
  FaRedo,
  FaDownload,
  FaUpload,
} from "react-icons/fa";

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
  exportImage: () => void;
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
  exportImage,
}) => {
  return (
    <div className="toolbar bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 transition-colors duration-300 rounded-pill shadow-lg py-1 mb-3">
      <div className="d-flex align-items-center justify-content-between">
        <ButtonGroup className="me-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Pen</Tooltip>}>
            <Button
              variant={tool === "pen" ? "primary" : "outline-primary"}
              onClick={() => setTool("pen")}
              className="rounded-start"
            >
              <FaPen />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Brush</Tooltip>}>
            <Button
              variant={tool === "brush" ? "primary" : "outline-primary"}
              onClick={() => setTool("brush")}
            >
              <FaPaintBrush />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Eraser</Tooltip>}>
            <Button
              variant={tool === "eraser" ? "primary" : "outline-primary"}
              onClick={() => setTool("eraser")}
              className="rounded-end"
            >
              <FaEraser />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>

        <Form.Group className="d-flex align-items-center me-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Color</Tooltip>}>
            <Form.Control
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="me-2"
              style={{
                width: "40px",
                height: "40px",
                padding: 0,
                borderRadius: "100%",
              }}
            />
          </OverlayTrigger>
          <Form.Range
            min="1"
            max="50"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="me-2"
            style={{ width: "100px" }}
          />
          <span className="text-gray-900 dark:text-white small">
            {lineWidth}px
          </span>
        </Form.Group>

        <ButtonGroup className="me-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Undo</Tooltip>}>
            <Button variant="outline-secondary" onClick={undo}>
              <FaUndo />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Redo</Tooltip>}>
            <Button variant="outline-secondary" onClick={redo}>
              <FaRedo />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>

        <ButtonGroup>
          <OverlayTrigger placement="top" overlay={<Tooltip>Export</Tooltip>}>
            <Button variant="outline-success" onClick={exportImage}>
              <FaDownload />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Upload</Tooltip>}>
            <label
              htmlFor="image-upload"
              className="btn btn-outline-primary mb-0"
            >
              <FaUpload />
            </label>
          </OverlayTrigger>
        </ButtonGroup>
      </div>
      <input
        id="image-upload"
        type="file"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Toolbar;
