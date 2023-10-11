import { ObjectId } from "mongoose";

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
