import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import { configs } from "../config";
import { authRepository, tokenRepository } from "../repositories";
import { authService, tokenService } from "../services";
import { IJwt, IMessage } from "../types";

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

  public async activatedUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IMessage>> {
    try {
      const { actionToken } = req.params;

      await authService.activatedUser(actionToken);

      return res.status(200).json("Verification successful");
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IJwt>> {
    try {
      const user = await authRepository.getUserByParams({
        email: req.body.email,
      });
      const tokenPair = await authService.login(user);
      return res.status(200).json({ ...tokenPair });
    } catch (e) {
      next(e);
    }
  }
  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IMessage>> {
    try {
      const { authorization } = req.headers;
      const tokenSecret = configs.ACCESS_TOKEN_SECRET;

      const [_, token] = authorization.split(" ");
      const { userId } = (await jwt.verify(token, tokenSecret)) as JwtPayload;

      const tokenModel = await tokenRepository.getTokenByParams({
        _userId: userId,
      });

      await tokenService.logout(tokenModel._id);

      return res.status(204).json("Logout success");
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
