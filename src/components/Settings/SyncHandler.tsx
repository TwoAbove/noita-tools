import { db } from '../../services/db';

class SyncHandler {
  async sendToSync(): Promise<number> {
    const data = await db.exportDB();
    const fd = new FormData();
    fd.append('upl', data, 'db');
    const res = await (await fetch(`/api/db_dump/`, {
      method: 'POST',
      body: fd
    })).json();
    return res.id;
  }

  async getSettingsFrom(id: string): Promise<void> {
    const data = await (await fetch(`/api/db_dump/${id}`)).blob();
    await db.importDB(data);
  }
}

export default SyncHandler;
