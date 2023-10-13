import { ObjectId } from "mongoose";

import { IUser } from "./user.types";

export interface IMessage {
  message: string;
}
export interface ITokenPayload {
  _id: ObjectId;
}
export interface IActivated extends Document {
  _id: ITokenPayload;
  accessToken: string;
  userEmail: string;
}

export interface ICredentials extends Document {
  email: string;
  password: string;
}

export interface IJwt {
  accessToken: string;
  refreshToken: string;
}

export interface ITokensPair {
  userId?: ObjectId;
  name: string;
}

export interface IToken extends IJwt, Document {
  _id: ITokenPayload;
  _userId?: ObjectId | IUser;
}
