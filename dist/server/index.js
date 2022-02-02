"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("boardgame.io/server");
const RPS_1 = require("../games/RPS");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const next_1 = __importDefault(require("next"));
const firebase_1 = require("./firebase");
const port = parseInt(process.env.PORT || '6969', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = (0, server_1.Server)({
        games: [RPS_1.RPS], origins: [server_1.Origins.LOCALHOST, "https://*.jimmyboy.dev"], db: firebase_1.db,
        generateCredentials: async (ctx) => {
            const token = ctx.request.header["authentication"];
            console.log("Client token:", token);
            // console.log("Headers Received: ", ctx.request.header);
            // if (!token) return nanoid()
            const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
            return decodedToken.sub;
        },
        authenticateCredentials: async (creds, playerMetadata) => {
            if (creds) {
                const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(creds);
                if (decodedToken.uid === (playerMetadata === null || playerMetadata === void 0 ? void 0 : playerMetadata.credentials)) {
                    // console.log("authenticated")
                    return true;
                }
                else
                    console.log("Not Authenticated, User ID Received is", decodedToken.uid, "but expected", playerMetadata === null || playerMetadata === void 0 ? void 0 : playerMetadata.credentials);
            }
            // console.log("creds", creds, playerMetadata);
            return false;
        },
    });
    server.router.all('(.*)', async (ctx, next) => {
        if (ctx.path.match(/(games|socket)/g))
            return next();
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });
    server.app.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });
    server.app.use(server.router.routes());
    server.run(port);
    // tslint:disable-next-line:no-console
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
});
