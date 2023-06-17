const { Server: SocketIOServer } = require("socket.io");

const { handleLiveSeed } = require("./liveSeed");
const { handleCompute, counts } = require("./compute");
const { rooms } = require("./rooms");

const corsDomains = [
  "dev.noitool.com",
  "noitool.com",
  "localhost:3000",
  "localhost:3001",
  "127.0.0.1:3000",
  "127.0.0.1:3001",
];
const corsSchemes = ["http://", "https://", "ws://", "wss://", ""];
const allowedCORS = corsSchemes.flatMap(ext => corsDomains.map(d => ext + d));

const handleConnection = (socket, io) => {
  handleLiveSeed(socket, io);
  handleCompute(socket, io);
};

const makeIO = (server, app) => {
  app.get("/api/cluster_stats", (req, res) => {
    res.json({
      hosts: counts.hosts,
      workers: counts.workers + 1, // 1 is for the ECS task
      appetite: counts.appetite,
    });
  });

  const io = new SocketIOServer(server, {
    cors: {
      origin: function (origin, callback) {
        if (allowedCORS.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    },
  });

  io.on("connection", socket => {
    console.log("New connection");
    handleConnection(socket, io);
  });

  io.of("/").adapter.on("delete-room", room => {
    // Room is empty
    rooms.delete(room);
  });
};

module.exports = makeIO;
