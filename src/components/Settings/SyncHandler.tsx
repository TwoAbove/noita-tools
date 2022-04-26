import { db } from '../../services/db';

class SyncHandler {
  async getId(): Promise<string> {
    const data = await (await fetch('/db_dump')).json();
    return data.id;
  }

  async sendToSync(id: string): Promise<void> {
    const data = await db.exportDB();
    console.log(data);
    const res = await fetch(`/db_dump/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': data.type },
      body: data
    });
    // await db.importDB(res);
  }

  async getSettingsFrom(id: string): Promise<void> {
    const data = await (await fetch(`/db_dump/${id}`)).blob();
    await db.importDB(data);
  }
}

export default SyncHandler;
