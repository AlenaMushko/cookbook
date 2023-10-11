import { Document } from "mongoose";

import { EGenders } from "../models";

export interface IUser extends Document {
  name?: string;
  age?: number;
  email: string;
  password: string;
  gender?: EGenders;
  verify: boolean;
  actionToken: string;
}
