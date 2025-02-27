const rooms = new Set<string>();

const randomText = (chars: string, length: number): string => {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

const roomLength = 4;
const chars = "1234";

const getRoomNumber = (): string | undefined => {
  if (rooms.size > Math.pow(10, roomLength)) {
    console.error("Rooms full");
    return;
  }
  let finalNumber: string | undefined;
  while (!finalNumber) {
    const tryNumber = randomText(chars, roomLength);
    if (!rooms.has(tryNumber)) {
      finalNumber = tryNumber;
    }
  }
  return finalNumber;
};

export { getRoomNumber, rooms };
