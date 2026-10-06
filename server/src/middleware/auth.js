import { httpError } from "../lib/httpError.js";
import { verifyToken } from "../lib/jwt.js";
import { User } from "../models/User.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) return next(httpError(401, "Missing Authorization Bearer token"));

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).lean();
    if (!user) return next(httpError(401, "Invalid token"));

    req.user = user;
    next();
  } catch {
    next(httpError(401, "Invalid token"));
  }
}

