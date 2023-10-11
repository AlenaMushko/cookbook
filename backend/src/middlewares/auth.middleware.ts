import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { authRepository } from "../repositories";

class AuthMiddleware {
  public async isEmailExist(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authRepository.getUserByParams({
        email: req.body.email,
      });
      if (user) {
        throw new ApiError("Email already exists", 409);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}
export const authMiddleware = new AuthMiddleware();
