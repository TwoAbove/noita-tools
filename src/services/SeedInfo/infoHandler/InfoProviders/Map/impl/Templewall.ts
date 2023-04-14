// data/scripts/biomes/temple_wall.lua
import Base from "../Base";
class Templewall extends Base {
  chestLevel = 3;

  init(x: number, y: number) {
    this.spawn_altar_top(x, y, true);
  }
}
export default Templewall;
