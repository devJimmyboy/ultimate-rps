// import { socker } from './sockets';
import express, { NextFunction } from "express";
import { createServer, IncomingMessage } from "http";
import socketio, { Server, Socket } from "socket.io";



import * as dotenv from "dotenv"
import logger from "./logger";
import { join } from "path";
import DuelManager from "./sockets/DuelManager";
import session, { Session, SessionData } from "express-session";
import MongoStore from "connect-mongo";
// import passport from "passport";
import bodyParser from "body-parser";
import auth from "./auth";
import UserManager from "./auth/UserManager";
import mongoose from "mongoose";
import routes from "./routes";
import { customAlphabet } from "nanoid";
import passport from "passport";
import { nanoid } from "./nanoid";
dotenv.config()


declare module 'express-session' {
  interface SessionData {
    connections: number;
    uid: string;
    socketId: string;
  }
}

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:27017/rps`).then(() => { logger.log("Connected to mongo") }).catch(err => { logger.error(err) })

var sessionMiddleware = session({
  name: "rps_data",
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({

    mongoUrl: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:27017/rps`,

  }),
  cookie: {}
});

const port = process.env.PORT || 6969
const host = process.env.HOST || 'localhost'



const app = express();

// app.use(express.json());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
auth(app)
app.use("/", express.static(join(__dirname, "../../client", 'dist'), {}));

app.get("/", (req, res, next) => {
  const isAuthenticated = !!req.user;
  if (isAuthenticated) {
    logger.log(`user is authenticated, session is ${req.session.id}`);
  }
  else {
    res.redirect("/login")
  }
  next()
});


const server = createServer(app);
const io = new Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>(server, { /* options */ });

routes(app, io)

const wrap = (middleware: (...args: any) => any) => (socket: RPSSocket, next: NextFunction) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));



const userManager = new UserManager(io);
const duelManager = new DuelManager(io);

io.on("connection", (socket) => {
  socket.join(socket.user.uid);

  userManager.registerSocket(socket);
  duelManager.registerSocket(socket);
  logger.info(`${socket.id} connected: User ${socket.user.uid || 'unknown'}`)
});

server.listen(port, () => {
  logger.log(`application is running at: http://localhost:${port}`);;
});