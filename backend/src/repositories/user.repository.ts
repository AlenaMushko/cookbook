import { ApiError } from "../errors/api.error";
import { User } from "../models";
import { ITokenPayload, IUser } from "../types";

class UserRepository {
  public async updateById(
    userId: ITokenPayload,
    value: Partial<IUser>,
  ): Promise<IUser> {
    try {
      return await User.findByIdAndUpdate(userId, { ...value }, { new: true });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userRepository = new UserRepository();
