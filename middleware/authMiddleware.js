import {
  BadRequestError,
  UnAuthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { verifyToken } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnAuthenticatedError("authentication failed");

  try {
    const { userId, role } = verifyToken(token);
    // CREATE REQ.USER
    const demoUser = userId === "64d13d2f7d671cd96a10119b";

    req.user = { userId, role, demoUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError(
      "sorry, authentication failed. please try to log in"
    );
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export const checkForDemoUser = (req, res, next) => {
  if (req.user.demoUser)
    throw new BadRequestError("This demo account is Read Only!");
  next();
};
