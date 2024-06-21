import { Router } from "express";
import multer from "multer";

const router = Router();

const dbs = {};

router.get("/db_dump/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.sendStatus(400);
  }
  res.status(200).send(dbs[id]);
  delete dbs[id];
});

const m = multer();

import { getRoomNumber } from "./io/rooms.mjs";

router.post("/db_dump/", m.any(), (req, res) => {
  const id = getRoomNumber();
  dbs[id] = req.files[0].buffer;
  res.send({ id });
  setTimeout(() => {
    delete dbs[id];
  }, 900000); // 15 minutes
});

export default router;
