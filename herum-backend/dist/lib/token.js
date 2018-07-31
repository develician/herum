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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var jwtSecret = process.env.JWT_SECRET;
var jwt = require("jsonwebtoken");
/**
 * JWT 토큰 생성
 * @param {any} payload
 * @returns {string} token
 */
exports.generateToken = function (payload, category) {
    return new Promise(function (resolve, reject) {
        jwt.sign(payload, jwtSecret, {
            expiresIn: "7d"
        }, function (error, token) {
            if (error)
                reject(error);
            resolve(token);
        });
    });
};
exports.decodeToken = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, jwtSecret, function (error, decoded) {
            if (error)
                reject(error);
            resolve(decoded);
        });
    });
};
exports.jwtMiddleware = function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var token, decoded, _id, profile, freshToken, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = ctx.cookies.get("access_token");
                if (!token) {
                    return [2 /*return*/, next()];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, exports.decodeToken(token)];
            case 2:
                decoded = _a.sent();
                if (!(Date.now() / 1000 - decoded.iat > 60 * 60 * 24)) return [3 /*break*/, 4];
                _id = decoded._id, profile = decoded.profile;
                return [4 /*yield*/, exports.generateToken({ _id: _id, profile: profile }, "account")];
            case 3:
                freshToken = _a.sent();
                ctx.cookies.set("access_token", freshToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: true
                });
                _a.label = 4;
            case 4:
                // ctx.request.user 에 디코딩된 값을 넣어줍니다
                ctx.request.user = decoded;
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                // token validate 실패
                ctx.request.user = null;
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, next()];
        }
    });
}); };
