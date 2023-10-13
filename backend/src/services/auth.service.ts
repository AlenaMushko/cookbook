import { EEmailAction } from "../enums";
import { ApiError } from "../errors/api.error";
import { EActionActivatedTokenTypes } from "../models";
import {
  authRepository,
  tokenRepository,
  userRepository,
} from "../repositories";
import { IJwt, IUser } from "../types";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(body: IUser): Promise<void> {
    try {
      const actionToken = tokenService.generateVerifyToken(
        body.email,
        EActionActivatedTokenTypes.Activated,
      );

      const hashedPassword = await passwordService.hash(body.password);

      Promise.all([
        await authRepository.register(body, hashedPassword),
        await authRepository.actionToken(
          body,
          actionToken,
          EActionActivatedTokenTypes.Activated,
        ),
      ]);

      await emailService.sendEmail(body.email, EEmailAction.REGISTER, {
        name: body.name + ", " || " ",
        actionToken,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async activatedUser(actionToken: string): Promise<void> {
    try {
      const activated = await authRepository.findActivated(actionToken);
      const user = await authRepository.getUserByParams({
        email: activated.userEmail,
      });

      Promise.all([
        await authRepository.deleteActivated(activated._id),
        await authRepository.findUserByIdAndUpdate(user, { verify: true }),
      ]);

      await emailService.welcomeEmail(user.email, EEmailAction.WELCOME, {
        name: user.name + ", " || " ",
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(user: IUser): Promise<IJwt> {
    try {
      const { name, _id } = user;
      const tokenPair = tokenService.generateTokenPairs({
        userId: _id,
        name: name,
      });

      Promise.all([
        await tokenRepository.createToken({ ...tokenPair, _userId: _id }),
        await userRepository.updateById(_id, {
          lastVisited: new Date(),
        }),
      ]);

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
