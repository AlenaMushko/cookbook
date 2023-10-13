import * as jwt from "jsonwebtoken";

import { configs } from "../config";
import { ApiError } from "../errors/api.error";
import { EActionActivatedTokenTypes } from "../models";
import { tokenRepository } from "../repositories";
import { ITokenPayload, ITokensPair } from "../types";

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

  public generateTokenPairs(payload: ITokensPair) {
    try {
      const accessTokenSecret = configs.ACCESS_TOKEN_SECRET;
      const refreshTokenSecret = configs.REFRESH_TOKEN_SECRET;

      const accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: "2h",
      });
      const refreshToken = jwt.sign(payload, refreshTokenSecret, {
        expiresIn: "30d",
      });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async logout(tokenId: ITokenPayload): Promise<void> {
    try {
      await tokenRepository.deleteToken(tokenId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
