import { RemoteSocket } from "socket.io"
import logger from "../logger"
import DuelModel from "../db/DuelModel"

export default class DuelManager {
  io: RPSServer
  duels: Map<string, Duel>
  constructor(io: RPSServer) {
    this.io = io
    this.duels = new Map()
  }

  registerSocket(socket: RPSSocket) {
    socket.on("duel:req", (data) => {
      logger.info("Duel request received from", socket.user.uid, "to", data)
      this.startDuel(socket, data)
    })
  }

  async startDuel(socket: RPSSocket, opponent: string) {
    let opponentSocket: RPSSocket | undefined = undefined
    if (opponent === "random") { }
    else {
      this.io.of("/").sockets.forEach(v => {
        if (v.user.uid === opponent) {
          opponentSocket = v
        }
      })
    }
    if (!opponentSocket) return;
    opponentSocket.emit("duel:req", socket.user.uid, (res) => {
      if (res) {
        logger.info("Duel request accepted, Starting Duel with ID of ", opponent, " with players ", [socket.user.uid, opponent])
        this.duels.set(opponent, new Duel(this.io, opponent, [socket, opponentSocket]))
        socket.join(opponent)
      }
    })
  }

}

class Duel {

  io: RPSServer
  duel: typeof DuelModel
  room: string
  players: [RPSSocket, RPSSocket]
  constructor(io: RPSServer, room: string, players: Duel["players"]) {
    this.io = io
    this.room = room
    this.players = players
    for (let p of this.players) {
      p.duel = this.room
    }
  }

  async start() {

  }

  async end() {

  }

  async cancel() {
    this.io.in(this.room).emit("duel:cancel", this.players[0].user.uid)
  }
}