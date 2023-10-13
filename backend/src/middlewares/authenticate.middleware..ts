import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import { configs } from "../config";
import { ApiError } from "../errors/api.error";
import { authRepository, tokenRepository } from "../repositories";

class AuthenticateMiddleware {
  public async isUserVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      if (!user.verify) {
        throw new ApiError("User not verified", 401);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenSecret = configs.ACCESS_TOKEN_SECRET;
      const { authorization } = req.headers;
      if (!authorization) {
        throw new ApiError("Authorization header missing", 401);
      }

      const [bearer, token] = authorization.split(" ");
      if (!bearer || !token) {
        throw new ApiError("Not authorized", 401);
      }

      const { userId } = (await jwt.verify(token, tokenSecret)) as JwtPayload;

      const user = await authRepository.getUserByParams({ _id: userId });
      const tokenModel = await tokenRepository.getTokenByParams({
        _userId: userId,
      });
      if (!user || !tokenModel) {
        throw new ApiError("Token not valid", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}
export const authenticateMiddleware = new AuthenticateMiddleware();
