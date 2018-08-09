"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var account_1 = __importDefault(require("models/account"));
var joi_1 = __importDefault(require("joi"));
var post_1 = __importDefault(require("models/post"));
var mongoose_1 = __importDefault(require("mongoose"));
var ObjectId = mongoose_1.default.Types.ObjectId;
var redis = require('redis');
var publisher = redis.createClient();
var write = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var user, account, count, schema, result, content, post, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = ctx.request.user;
                if (!user) {
                    ctx.status = 403;
                    ctx.body = {
                        message: 'not logged in',
                    };
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, account_1.default.findById(user._id).exec()];
            case 2:
                account = _a.sent();
                if (!account) {
                    ctx.status = 403;
                    return [2 /*return*/];
                }
                count = account.thoughtCount + 1;
                schema = joi_1.default.object().keys({
                    content: joi_1.default.string()
                        .min(5)
                        .max(1000)
                        .required(),
                });
                result = joi_1.default.validate(ctx.request.body, schema);
                if (result.error) {
                    ctx.status = 400;
                    return [2 /*return*/];
                }
                content = ctx.request.body.content;
                return [4 /*yield*/, post_1.default.write({
                        count: count,
                        username: user.profile.username,
                        content: content,
                    })];
            case 3:
                post = _a.sent();
                return [4 /*yield*/, account.increaseThoughtCount()];
            case 4:
                _a.sent();
                post = post.toJSON();
                delete post.likes;
                post.liked = false;
                ctx.body = post;
                publisher.publish('posts', JSON.stringify({
                    type: 'posts/RECEIVE_NEW_POST',
                    payload: post,
                }));
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                ctx.throw(e_1, 500);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var list = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var _a, cursor, username, user, self, posts, next, checkLiked, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = ctx.query, cursor = _a.cursor, username = _a.username;
                if (cursor && !ObjectId.isValid(cursor)) {
                    ctx.status = 400;
                    return [2 /*return*/];
                }
                user = ctx.request.user;
                self = user ? user.username : null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, post_1.default.list({ cursor: cursor, username: username, self: self })];
            case 2:
                posts = _b.sent();
                next = posts.length === 20
                    ? "/api/posts/?" + (username ? "username=" + username + "&" : '') + "cursor=" + posts[19]._id
                    : null;
                checkLiked = function (post) {
                    // posts 에 스키마에 속하지 않은 값을 추가해주려면 toObject() 를 해주어야합니다.
                    // 혹은, 쿼리를 하게 될 떄 .lean().exec() 의 형식으로 해야합니다.
                    post = post.toObject();
                    // 비로그인 상태라면 false
                    // 배열에 아이템이 있다면, 자신의 아이디가 들어있다는 뜻이니 true
                    var checked = Object.assign(post, {
                        liked: user !== null && post.likes.length > 0,
                    });
                    delete checked.likes; // likes key 제거
                    return checked;
                };
                posts = posts.map(checkLiked); // map 을 통하여 각 포스트를 변형시켜줍니다
                ctx.body = {
                    next: next,
                    data: posts,
                };
                return [3 /*break*/, 4];
            case 3:
                e_2 = _b.sent();
                ctx.throw(e_2, 500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = { write: write, list: list };
