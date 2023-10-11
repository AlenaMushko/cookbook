import { NextFunction, Request, Response } from "express";

import { authService } from "../services";
import { IMessage } from "../types";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IMessage>> {
    try {
      await authService.register(req.body);

      return res.status(201).json("User created");
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
