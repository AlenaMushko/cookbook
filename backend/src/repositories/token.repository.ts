import { FilterQuery } from "mongoose";

import { ApiError } from "../errors/api.error";
import { Token } from "../models";
import { IToken, ITokenPayload } from "../types";

class TokenRepository {
  public async createToken(body: Partial<IToken>): Promise<IToken> {
    try {
      return await Token.create(body);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getTokenByParams(
    params: FilterQuery<IToken>,
    selection?: string[],
  ): Promise<IToken> {
    try {
      return await Token.findOne(params, selection);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async deleteToken(_id: ITokenPayload): Promise<void> {
    await Token.deleteOne({ _id });
  }
}

export const tokenRepository = new TokenRepository();
