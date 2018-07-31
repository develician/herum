"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var auth_ctrl_1 = __importDefault(require("./auth.ctrl"));
var auth = new koa_router_1.default();
auth.post("/register/local", auth_ctrl_1.default.localRegister);
auth.post("/login/local", auth_ctrl_1.default.localLogin);
auth.get("/exists/:key(email|username)/:value", auth_ctrl_1.default.exists);
auth.post("/logout", auth_ctrl_1.default.logout);
auth.get("/check", auth_ctrl_1.default.check);
exports.default = auth;
