import { Response } from "express";
import { randomUUID } from "crypto";

export const genSessionCookie = (res: Response): void => {
  res.cookie("noitoolSessionToken", randomUUID(), {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
};
