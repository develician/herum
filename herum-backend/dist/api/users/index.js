"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var user_ctrl_1 = __importDefault(require("./user.ctrl"));
var users = new koa_router_1.default();
users.get('/:username', user_ctrl_1.default.getProfile);
users.get('/:username/thumbnail', user_ctrl_1.default.getThumbnail);
exports.default = users;
