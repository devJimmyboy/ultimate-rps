import { Session, SessionData } from "express-session"
import { nanoid } from "nanoid"
import User from "../db/UserModel"
import UserModel from "../db/UserModel"
import logger from "../logger"



export default class UserManager {
  io: RPSServer

  constructor(io: RPSServer) {
    this.io = io
    io.use((socket, next) => {
      const session: Session & SessionData = (socket.request as any).session;
      // const user = socket.request.user;
      // if (user) {
      if (session) {
        console.log(`saving sid ${socket.id} in session ${session.id}`);
        session.socketId = socket.id;
        session.save();
        socket.user = { uid: session.uid, name: "" };
        return next();
      }
      const uid = nanoid();
      session.uid = uid;
      socket.user = { uid: uid, name: "" };
      next(new Error('unauthorized'))

    });
  }

  registerSocket(socket: RPSSocket) {
    socket.on("user:check", (data, cb) => this.userExists(socket, data).then(cb))
    socket.on("user:getInfo", (cb) => {
      cb(socket.user ? socket.user : { uid: '', name: 'anon' });
    })
  }

  async getInfo(socket: RPSSocket): Promise<UserData | null> {
    return UserModel.findOne({ uid: socket.user.uid }).exec().then((user) => {
      if (!user) {
        const newUser = new UserModel({ uid: socket.user.uid, username: "anon" }
        )
        return newUser.save().then((user) => {
          return { name: user.username, uid: user.uid }
        })
      }
      return {
        name: user.username,
        uid: user.uid
      }
    }).catch((err) => { logger.error(err); return null })
  }

  async userExists(socket: RPSSocket, nameOrId: string): Promise<boolean> {
    if (nameOrId === socket.user.uid) return false;
    return UserModel.find({ $or: [{ username: { $regex: new RegExp(`^${nameOrId}$`, "i") } }, { uid: nameOrId }] }).lean().limit(1).exec()
      .then((users) => {
        const exists = users.length > 0;
        logger.debug(`User '${nameOrId}' ${exists ? "exists!" : "does not exist!"}`)
        return exists
      }).catch((err) => { logger.error(err); return false })
  }
}