const rooms = new Set();

const randomText = (chars, length) => {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

const roomLength = 4;
const chars = "1234";

const getRoomNumber = () => {
  if (rooms.size > Math.pow(10, roomLength)) {
    console.error("Rooms full");
    return;
  }
  let finalNumber;
  while (!finalNumber) {
    const tryNumber = randomText(chars, roomLength);
    if (!rooms[tryNumber]) {
      finalNumber = tryNumber;
    }
  }
  return finalNumber;
};

module.exports = { getRoomNumber, rooms };
