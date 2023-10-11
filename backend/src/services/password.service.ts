import bcrypt from "bcrypt";

import { ApiError } from "../errors/api.error";

class PasswordService {
  public async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 7);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const passwordService = new PasswordService();
