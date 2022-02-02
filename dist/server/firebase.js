"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app_1 = require("firebase-admin/app");
const bgio_firebase_1 = require("bgio-firebase");
const serviceAccountKey_json_1 = __importDefault(require("../secrets/serviceAccountKey.json"));
(0, app_1.initializeApp)({ credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default), databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL });
exports.db = new bgio_firebase_1.Firestore({
    config: {
        credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    }
});
