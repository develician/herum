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
var joi_1 = __importDefault(require("joi"));
var account_1 = __importDefault(require("models/account"));
var localRegister = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var schema, result, existing, e_1, account, token, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schema = joi_1.default.object().keys({
                    username: joi_1.default.string()
                        .alphanum()
                        .min(4)
                        .max(15)
                        .required(),
                    email: joi_1.default.string()
                        .email()
                        .required(),
                    password: joi_1.default.string()
                        .required()
                        .min(6)
                });
                result = joi_1.default.validate(ctx.request.body, schema);
                if (result.error) {
                    ctx.status = 400;
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, account_1.default.findByEmailOrUsername(ctx.request.body)];
            case 2:
                existing = _a.sent();
                if (existing) {
                    ctx.status = 409;
                    ctx.body = {
                        key: existing.email === ctx.request.body.email ? "email" : "username"
                    };
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                ctx.throw(e_1, 500);
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 7, , 8]);
                return [4 /*yield*/, account_1.default.localRegister(ctx.request.body)];
            case 5:
                account = _a.sent();
                return [4 /*yield*/, account.generateToken()];
            case 6:
                token = _a.sent();
                ctx.cookies.set("access_token", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7
                });
                ctx.body = account.profile;
                return [3 /*break*/, 8];
            case 7:
                e_2 = _a.sent();
                ctx.throw(e_2, 500);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var localLogin = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var schema, result, _a, email, password, account, token, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                schema = joi_1.default.object().keys({
                    email: joi_1.default.string()
                        .email()
                        .required(),
                    password: joi_1.default.string().required()
                });
                result = joi_1.default.validate(ctx.request.body, schema);
                if (result.error) {
                    ctx.status = 400;
                    return [2 /*return*/];
                }
                _a = ctx.request.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, account_1.default.findByEmail(email)];
            case 2:
                account = _b.sent();
                if (!account || !account.validatePassword(password)) {
                    ctx.status = 403;
                    return [2 /*return*/];
                }
                return [4 /*yield*/, account.generateToken()];
            case 3:
                token = _b.sent();
                ctx.cookies.set("access_token", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7
                });
                // console.log(ctx.request.user);
                ctx.body = account.profile;
                return [3 /*break*/, 5];
            case 4:
                e_3 = _b.sent();
                ctx.throw(e_3, 500);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var exists = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var _a, key, value, account, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = ctx.params, key = _a.key, value = _a.value;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (key === "email"
                        ? account_1.default.findByEmail(value)
                        : account_1.default.findByUsername(value))];
            case 2:
                account = _b.sent();
                ctx.body = {
                    exists: account !== null
                };
                return [3 /*break*/, 4];
            case 3:
                e_4 = _b.sent();
                ctx.throw(e_4, 500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var check = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = ctx.request.user;
        if (!user) {
            ctx.status = 403;
            return [2 /*return*/];
        }
        ctx.body = user.profile;
        return [2 /*return*/];
    });
}); };
var logout = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.cookies.set("access_token", null, {
            maxAge: 0,
            httpOnly: true
        });
        ctx.status = 204;
        return [2 /*return*/];
    });
}); };
exports.default = { localRegister: localRegister, localLogin: localLogin, exists: exists, logout: logout, check: check };
