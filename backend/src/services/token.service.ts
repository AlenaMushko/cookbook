import * as jwt from "jsonwebtoken";

import { configs } from "../config";
import { ApiError } from "../errors/api.error";
import { EActionActivatedTokenTypes } from "../models";

class TokenService {
  public generateVerifyToken(email: string, tokenType: string): string {
    try {
      let secret;
      const payload = { email };

      switch (tokenType) {
        case EActionActivatedTokenTypes.Activated:
          secret = configs.ACTIVATED_TOKEN_SECRET;
          break;
        case EActionActivatedTokenTypes.ForgotPassword:
          secret = configs.FORGOT_TOKEN_SECRET;
          break;
      }

      return jwt.sign(payload, secret, { expiresIn: "7d" });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
