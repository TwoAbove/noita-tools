const { randomUUID } = require("crypto");

const genSessionCookie = res => {
  res.cookie("noitoolSessionToken", randomUUID(), {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
};

module.exports = {
  genSessionCookie,
};
