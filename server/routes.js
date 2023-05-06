const { Router } = require("express");
const multer = require("multer");

const router = Router();

router.get("/profile_enabled", (req, res) => {
  res.send({ enabled: process.env.PROFILE_ENABLED === "true" });
});

router.get("/daily-seed", async (req, res) => {
  // get the seed from http://takapuoli.noitagame.com/callback/
  // and send it to the client
  const ans = await fetch("http://takapuoli.noitagame.com/callback/").then(r => r.text());
  const [a, b, c, d] = ans.split(";");
  res.append("Cache-Control", "no-store");
  res.send({ seed: b });
});

const dbs = {};

router.get("/api/db_dump/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.sendStatus(400);
  }
  res.status(200).send(dbs[id]);
  delete dbs[id];
});

const m = multer();

const { getRoomNumber } = require("./io/rooms");

router.post("/api/db_dump/", m.any(), (req, res) => {
  const id = getRoomNumber();
  dbs[id] = req.files[0].buffer;
  res.send({ id });
  setTimeout(() => {
    delete dbs[id];
  }, 900000); // 15 minutes
});

module.exports = router;
