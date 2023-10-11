import { EEmailAction } from "../enums";
import { EActionActivatedTokenTypes } from "../models";
import { authRepository } from "../repositories";
import { IUser } from "../types";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(body: IUser): Promise<void> {
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
  }
}

export const authService = new AuthService();
