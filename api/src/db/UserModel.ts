import { model, Schema } from "mongoose";

interface User {
  username: string;
  email?: string;
  avatar?: string;
  uid: string;
  providerCreds?: {
    accessToken: string;
    refreshToken: string;
  }
}

const schema = new Schema<User>({
  avatar: String,
  email: String,
  username: { type: String, default: "" },
  uid: { type: String, required: true },
  providerCreds: {
    accessToken: String,
    refreshToken: String
  }
})

const UserModel = model<User>('User', schema);
export default UserModel;