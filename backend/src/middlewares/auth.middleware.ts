import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { authRepository } from "../repositories";
import { passwordService } from "../services";

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

  public async isActivated(req: Request, res: Response, next: NextFunction) {
    try {
      const { actionToken } = req.params;
      const activated = await authRepository.findActivated(actionToken);

      if (!activated || activated.accessToken !== actionToken) {
        throw new ApiError("Invalid or expired token", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async activatedUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { actionToken } = req.params;

      const activated = await authRepository.findActivated(actionToken);

      const user = await authRepository.getUserByParams({
        email: activated.userEmail,
      });

      if (!user) {
        throw new ApiError("Invalid or expired token", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authRepository.getUserByParams({
        email: req.body.email,
      });
      if (!user) {
        throw new ApiError("Invalid email or password", 401);
      }
      res.locals.user = user;

      next();
    } catch (e) {
      next(e);
    }
  }
  public async loginError(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      const isMatched = await passwordService.compare(
        req.body.password,
        user.password,
      );
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}
export const authMiddleware = new AuthMiddleware();
