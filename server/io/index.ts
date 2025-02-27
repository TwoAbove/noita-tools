import { Server as SocketIOServer } from "socket.io";
import { Express } from "express";
import { Server as HttpServer } from "http";

import { handleLiveSeed } from "./liveSeed";
import { handleCompute, counts } from "./compute";
import { rooms } from "./rooms";

const corsDomains = [
  "dev.noitool.com",
  "www.noitool.com",
  "noitool.com",
  "localhost:3000",
  "localhost:3001",
  "127.0.0.1:3000",
  "127.0.0.1:3001",
];

const corsSchemes = ["http://", "https://", "ws://", "wss://", ""];
const allowedCORS = corsSchemes.flatMap(ext => corsDomains.map(d => ext + d));

const handleConnection = (
  socket: SocketIOServer["sockets"]["sockets"]["values"] extends Generator<infer T, any, any> ? T : never,
  io: SocketIOServer,
): void => {
  handleLiveSeed(socket);
  handleCompute(socket, io);

  socket.on("get_cluster_stats", (callback?: (stats: typeof counts) => void) => {
    if (callback) {
      callback({
        hosts: counts.hosts,
        workers: counts.workers,
        appetite: counts.appetite,
      });
    }
  });
};

const makeIO = (server: HttpServer, app: Express): void => {
  app.get("/api/cluster_stats", (req, res) => {
    res.json({
      hosts: counts.hosts,
      workers: counts.workers,
      appetite: counts.appetite,
    });
  });

  const io = new SocketIOServer(server, {
    cors: {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (allowedCORS.indexOf(origin || "") !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    },
  });

  io.engine.on("connection_error", (err: Error) => {
    console.log(err);
  });

  io.on("connection", socket => {
    console.log("New connection");
    handleConnection(socket, io);
  });

  io.of("/").adapter.on("delete-room", (room: string) => {
    // Room is empty
    rooms.delete(room);
  });
};

export default makeIO;
