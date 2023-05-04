import { db } from "../../services/db";

class SyncHandler {
  async sendDB(url: string): Promise<any> {
    const data = await db.exportDB();
    const fd = new FormData();
    fd.append("upl", data, "db");
    const res = await (
      await fetch(url, {
        method: "POST",
        body: fd,
      })
    ).json();
    return res;
  }

  async sendToSync(): Promise<number> {
    const url = `/api/db_dump/`;
    const res = await this.sendDB(url);
    return res.id;
  }

  async sendToDebug(): Promise<string> {
    const url = `/api/db_debug/`;
    const res = await this.sendDB(url);
    return res.id;
  }

  async getSettingsFrom(id: string): Promise<void> {
    const data = await (await fetch(`/api/db_dump/${id}`)).blob();
    await db.importDB(data);
  }
}

export default SyncHandler;
