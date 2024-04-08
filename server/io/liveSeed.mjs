import { getRoomNumber, rooms } from "./rooms.mjs";

const handleLiveSeed = socket => {
  let roomNumber;
  let isHostOfRoom = false;
  socket.on("host", customRoom => {
    roomNumber = customRoom || getRoomNumber();
    rooms.add(roomNumber);
    isHostOfRoom = true;
    socket.join(roomNumber);
    socket.emit("set_room", roomNumber);

    // cb('ok');
  });

  socket.on("seed", seed => {
    if (!isHostOfRoom) {
      return;
    }
    socket.to(roomNumber).emit("seed", seed);
  });

  socket.on("restart", () => {
    socket.to(roomNumber).emit("restart", "");
  });

  socket.on("disconnect", () => {
    //
  });
};

export { handleLiveSeed };
