import { Socket } from "socket.io";
import { getRoomNumber, rooms } from "./rooms";

const handleLiveSeed = (socket: Socket): void => {
  let roomNumber: string | undefined;
  let isHostOfRoom = false;

  socket.on("host", (customRoom: string | null) => {
    roomNumber = customRoom || getRoomNumber();
    if (!roomNumber) return;

    rooms.add(roomNumber);
    isHostOfRoom = true;
    socket.join(roomNumber);
    socket.emit("set_room", roomNumber);
  });

  socket.on("seed", (seed: string) => {
    if (!isHostOfRoom || !roomNumber) {
      return;
    }
    socket.to(roomNumber).emit("seed", seed);
  });

  socket.on("restart", () => {
    if (!roomNumber) return;
    socket.to(roomNumber).emit("restart", "");
  });

  socket.on("disconnect", () => {
    // Handle disconnect if needed
  });
};

export { handleLiveSeed };
