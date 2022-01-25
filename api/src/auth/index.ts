import { Application, RequestHandler } from "express";
import passport from "passport";
import UserModel from "../db/UserModel";
import { Strategy as CustomStrategy } from 'passport-custom';
import { OAuth2Strategy } from 'passport-oauth'
import { customAlphabet } from "nanoid";
import logger from "../logger";
import axios from "axios";


import { nanoid } from "../nanoid";



export default function auth(app: Application) {
  app.use(passport.initialize({ userProperty: "user" }));
  app.use(passport.session());


  passport.use("twitch", new OAuth2Strategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "http://localhost:6969/auth/twitch/callback",
    tokenURL: "https://id.twitch.tv/oauth2/token",
    authorizationURL: "https://id.twitch.tv/oauth2/authorize",
    scope: "user_read"
  },
    function (accessToken, refreshToken, profile, done) {
      axios.get("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID
        }
      }).then(res => {
        if (res.data?.data?.length > 0) {
          profile = res.data.data[0];
        }
        logger.log(`Twitch profile: ${JSON.stringify({ id: profile.id, displayName: profile["display_name"] } || {})}`);
      }).then(() => {
        UserModel.findOneAndUpdate({ uid: profile.id }, { username: profile["display_name"], providerCreds: { accessToken, refreshToken } }, {
          new: true,
          upsert: true // Make this update into an upsert
        }, function (err, user) {
          return done(err, user);
        });
      })

    }
  ));

  passport.use("anon", new CustomStrategy((req, cb) => {
    if (req.session?.uid) {
      UserModel.findOneAndUpdate({ uid: req.session.uid }, {}, { new: true }, (err, user) => {
        if (user)
          cb(err, user)
        else {
          req.session.destroy((err) => cb(err, null))
        }
      })
    }
    else {
      req.session.uid = nanoid();
      req.session.save((err) => cb(err, null))
      UserModel.findOneAndUpdate({ uid: req.session.uid }, { username: "anon" }, {
        new: true,
        upsert: true // Make this update into an upsert
      }, function (err, user) {
        return cb(err, user);
      });
    }

  }));

  // passport.transformAuthInfo((info, done) => {
  //   info.uid = info.uid || nanoid();
  //   done(null, info);
  // })

  passport.serializeUser(function (user: any, done) {
    done(null, user.uid);
  });

  passport.deserializeUser(function (uid, done) {
    UserModel.findOne({ uid }, function (err, user) {
      done(err, user);
    });
  });

  app.get("/login", passport.authenticate("anon", { successRedirect: "/" }))

  app.get("/auth/twitch", passport.authenticate("twitch"));


  app.get("/auth/twitch/callback", passport.authenticate("twitch", {
    failureRedirect: '/login'
  }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  });

}