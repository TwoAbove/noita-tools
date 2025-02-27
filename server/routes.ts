import { Router, Request, Response } from "express";
import multer from "multer";

const router = Router();

interface DbStorage {
  [key: number]: Buffer;
}

const dbs: DbStorage = {};

router.get("/db_dump/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.sendStatus(400);
  }
  res.status(200).send(dbs[id]);
  delete dbs[id];
});

const m = multer();

import { getRoomNumber } from "./io/rooms";

router.post("/db_dump/", m.any(), (req: Request, res: Response) => {
  const id = getRoomNumber();
  dbs[id] = (req.files as Express.Multer.File[])[0].buffer;
  res.send({ id });
  setTimeout(() => {
    delete dbs[id];
  }, 900000); // 15 minutes
});

export default router;
