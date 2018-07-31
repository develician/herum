"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var koa_1 = __importDefault(require("koa"));
var koa_router_1 = __importDefault(require("koa-router"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var mongoose_1 = __importDefault(require("mongoose"));
var api_1 = __importDefault(require("./api"));
var token_1 = require("lib/token");
var _a = process.env, _b = _a.PORT, port = _b === void 0 ? 4000 : _b, mongoURI = _a.MONGO_URI;
mongoose_1.default.Promise = global.Promise;
if (mongoURI !== undefined) {
    mongoose_1.default
        .connect(mongoURI, { useNewUrlParser: true })
        .then(function () {
        console.log("connected to mongo db");
    })
        .catch(function (e) {
        console.error(e);
    });
}
var app = new koa_1.default();
var router = new koa_router_1.default();
app.use(koa_bodyparser_1.default());
app.use(token_1.jwtMiddleware);
router.use("/api", api_1.default.routes());
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, function () {
    console.log("app is using port", port);
});
