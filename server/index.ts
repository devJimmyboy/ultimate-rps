import { Origins, Server } from 'boardgame.io/server';
import { RPS } from "../games/RPS"
import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import { parse } from 'url'
import next from 'next'
import { IncomingMessage } from "http";

import { db } from "./firebase";
import { nanoid } from "nanoid";

const port = parseInt(process.env.PORT || '6969', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = Server({
    games: [RPS], origins: [Origins.LOCALHOST, "https://*.jimmyboy.dev"], db,
    generateCredentials: async (ctx) => {
      const token = ctx.request.header["authentication"];
      console.log("Client token:", token);
      // console.log("Headers Received: ", ctx.request.header);

      // if (!token) return nanoid()
      const decodedToken = await admin.auth().verifyIdToken(token)
      return decodedToken.sub;

    },
    authenticateCredentials: async (creds, playerMetadata) => {
      if (creds) {

        const decodedToken = await admin.auth().verifyIdToken(creds)
        if (decodedToken.uid === playerMetadata?.credentials) {
          // console.log("authenticated")
          return true;
        }
        else
          console.log("Not Authenticated, User ID Received is", decodedToken.uid, "but expected", playerMetadata?.credentials)
      }
      // console.log("creds", creds, playerMetadata);

      return false
    },
  })
  server.router.all('(.*)', async (ctx, next) => {
    if (ctx.path.match(/(games|socket)/g))
      return next();
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.app.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.app.use(server.router.routes())


  server.run(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
    }`
  )
})