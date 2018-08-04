"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
exports.commentSchema = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        default: new Date(),
    },
    username: String,
    text: String,
});
exports.postSchema = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        default: new Date(),
    },
    count: Number,
    username: String,
    content: String,
    likesCount: {
        type: Number,
        default: 0,
    },
    likes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [exports.commentSchema],
        default: [],
    },
});
exports.postSchema.statics.write = function (_a) {
    var count = _a.count, username = _a.username, content = _a.content;
    var post = new this({
        count: count,
        username: username,
        content: content,
    });
    return post.save();
};
exports.postSchema.statics.list = function (_a) {
    var cursor = _a.cursor, username = _a.username, self = _a.self;
    var query = {};
    return this.find(query)
        .sort({ _id: -1 }) // _id 역순
        .limit(20) // 20개로 제한
        .exec();
};
exports.Post = mongoose_1.model('Post', exports.postSchema);
exports.default = exports.Post;
