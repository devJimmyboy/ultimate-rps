import { Express } from "express";
import passport from "passport";

export default function (app: Express, io: RPSServer) {

  app.post(
    "/login",
    passport.authenticate("anon", {
      successRedirect: "/",
      failureRedirect: "/",
    })
  );
  app.get(
    "/login",
    passport.authenticate("anon", {
      successRedirect: "/",
      failureRedirect: "/",
    })
  );

  app.post("/logout", (req, res) => {
    console.log(`logout ${req.session.id}`);
    const socketId = req.session.socketId;
    if (socketId && io.of("/").sockets.get(socketId)) {
      console.log(`forcefully closing socket ${socketId}`);
      io.of("/").sockets.get(socketId).user = undefined;
    }
    req.logout();
    res.cookie("connect.sid", "", { expires: new Date() });
    req.cookies
    res.redirect("/");

  });
}

