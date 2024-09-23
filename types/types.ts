export interface Point {
  x: number;
  y: number;
  tool: string;
  color: string;
  lineWidth: number;
}

export interface LineData {
  points: Point[];
  color?: string; // Optional, if needed
  lineWidth?: number; // Optional, if needed
}
