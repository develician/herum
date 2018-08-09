"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var postCtrl = __importStar(require("./posts.ctrl"));
var likesCtrl = __importStar(require("./likes.ctrl"));
var posts = new koa_router_1.default();
posts.post('/', postCtrl.default.write);
posts.get('/', postCtrl.default.list);
posts.post('/:postId/likes', likesCtrl.default.like);
posts.delete('/:postId/likes', likesCtrl.default.unlike);
exports.default = posts;
