import { model, Schema } from "mongoose";
import UserModel from "./UserModel";

interface Duel {
  turn: number;
  turns: Turn[];
  roomId: string;
  players: (typeof UserModel)[]
  socketIds: string[]
}
type Move = "sock" | "rock" | "paper";
interface Turn {
  turn: number;
  players: { uid: string; move: Move }[]
}

const schema = new Schema<Duel>({
  turn: Number,
  turns: [{
    type: {
      turn: Number, players: [{
        uid: String, move: String
      }]
    }
  }],
  roomId: String,
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  socketIds: [String]


})

const DuelModel = model<Duel>('Duel', schema);
export default DuelModel;