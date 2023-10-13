import { FilterQuery } from "mongoose";

import { ApiError } from "../errors/api.error";
import { Activated, User } from "../models";
import { IActivated, ITokenPayload, IUser } from "../types";

class AuthRepository {
  public async getUserByParams(
    params: FilterQuery<IUser>,
    selection?: string[],
  ): Promise<IUser> {
    return await User.findOne(params, selection);
  }

  public async register(body: IUser, hashedPassword: string): Promise<void> {
    try {
      await User.create({ ...body, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async actionToken(
    body: IUser,
    actionToken: string,
    tokenType: string,
  ): Promise<void> {
    await Activated.create({
      accessToken: actionToken,
      userEmail: body.email,
      tokenType,
    });
  }

  public async findActivated(accessToken: string): Promise<IActivated> {
    try {
      return (await Activated.findOne({
        accessToken,
      })) as unknown as IActivated;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async deleteActivated(_id: ITokenPayload): Promise<void> {
    try {
      await Activated.deleteOne({ _id });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async findUserByIdAndUpdate(
    user: IUser,
    params: FilterQuery<IUser>,
  ): Promise<void> {
    try {
      await User.findByIdAndUpdate(user._id, params);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authRepository = new AuthRepository();
