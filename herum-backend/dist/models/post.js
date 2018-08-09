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
var Comment = mongoose_1.model('Comment', exports.commentSchema);
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
exports.postSchema.methods.writeComment = function (_a) {
    var username = _a.username, text = _a.text;
    this.comments.unshift({ username: username, text: text });
    return this.save();
};
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
    var query = Object.assign({}, cursor ? { _id: { $lt: cursor } } : {}, username ? { username: username } : {});
    var projection = self
        ? {
            count: 1,
            username: 1,
            content: 1,
            comments: 1,
            likes: {
                $elemMatch: { $eq: self },
            },
            likesCount: 1,
            createdAt: 1,
        }
        : {};
    return this.find(query, projection)
        .sort({ _id: -1 }) // _id 역순
        .limit(20) // 20개로 제한
        .exec();
};
exports.postSchema.statics.like = function (_a) {
    var _id = _a._id, username = _a.username;
    return this.findByIdAndUpdate(_id, {
        $inc: { likesCount: 1 },
        $push: { likes: username },
    }, { new: true, select: 'likesCount' }).exec();
};
exports.postSchema.statics.unlike = function (_a) {
    var _id = _a._id, username = _a.username;
    return this.findByIdAndUpdate(_id, {
        $inc: { likesCount: -1 },
        $pull: { likes: username },
    }, { new: true, select: 'likesCount' }).exec();
};
exports.Post = mongoose_1.model('Post', exports.postSchema);
exports.default = exports.Post;
