import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import next, { NextApiHandler } from "next";

// Initialize Next.js app
const port = process.env.PORT ? process.env.PORT : 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  app.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
  });
});
