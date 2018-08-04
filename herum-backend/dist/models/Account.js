"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var crypto_1 = __importDefault(require("crypto"));
var token_1 = require("lib/token");
var hash = function (password) {
    if (process.env.SECRET_KEY !== undefined) {
        return crypto_1.default
            .createHmac('sha256', process.env.SECRET_KEY)
            .update(password)
            .digest('hex');
    }
    return '';
};
exports.accountSchema = new mongoose_1.Schema({
    profile: {
        username: String,
        thumbnail: {
            type: String,
            default: '/static/images/default_thumbnail.png',
        },
    },
    email: { type: String },
    social: {
        facebook: {
            id: String,
            accessToken: String,
        },
        google: {
            id: String,
            accessToken: String,
        },
    },
    password: String,
    thoughtCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
exports.accountSchema.methods.hash = function (password) {
    if (process.env.SECRET_KEY !== undefined) {
        return crypto_1.default
            .createHmac('sha256', process.env.SECRET_KEY)
            .update(password)
            .digest('hex');
    }
    return '';
};
exports.accountSchema.methods.increaseThoughtCount = function () {
    this.thoughtCount++;
    return this.save();
};
exports.accountSchema.statics.localRegister = function (_a) {
    var username = _a.username, email = _a.email, password = _a.password;
    var account = new this({
        profile: {
            username: username,
        },
        email: email,
        password: hash(password),
    });
    return account.save();
};
exports.accountSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email }).exec();
};
exports.accountSchema.statics.findByUsername = function (username) {
    return this.findOne({ username: username }).exec();
};
exports.accountSchema.statics.findByEmailOrUsername = function (_a) {
    var username = _a.username, email = _a.email;
    return this.findOne({
        $or: [{ 'profile.username': username }, { email: email }],
    }).exec();
};
exports.accountSchema.methods.validatePassword = function (password) {
    var hashed = hash(password);
    return this.password === hashed;
};
exports.accountSchema.methods.generateToken = function () {
    var payload = {
        _id: this._id,
        profile: this.profile,
    };
    return token_1.generateToken(payload, 'account');
};
exports.Account = mongoose_1.model('Account', exports.accountSchema);
exports.default = exports.Account;
