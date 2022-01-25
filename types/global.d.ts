import { Socket, Server } from "socket.io"
import { Socket as Client } from "socket.io-client";

declare module 'socket.io' {
  interface Socket {
    user: UserData;
    duel: string;
  }
}

declare global {
  interface ServerToClientEvents {
    "duel:start": (room: string) => void;
    "duel:req": (from: string, response: (res: boolean) => void) => void;
    "duel:action": (action: any) => void;
    "duel:end": (winner: string) => void;
    "duel:cancel": (from: string) => void;
    "duel:accept": (to: string) => void;

  }
  interface ClientToServerEvents {
    "duel:req": (opponent: string) => void;
    "user:change": (name: string, res: (allowed: boolean) => void) => void;
    "user:login": (creds: UserData, res: (creds: UserData) => void) => void;
    "user:check": (nameOrId: string, res: (exists: boolean) => void) => void;
    "user:getInfo": (res: (user: UserData | null) => void) => void;
  }
  interface InterServerEvents {
  }
  interface SocketData {

  }



  interface UserData {
    name: string;
    uid: string;
  }

  type RPSServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  type RPSSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

  type RPSClient = Client<ServerToClientEvents, ClientToServerEvents>
}