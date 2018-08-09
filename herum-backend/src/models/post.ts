import { Schema, Document, Model, model } from 'mongoose';

export interface CommentDocument extends Document {
  createdAt: Date;
  username: string;
  text: string;
}

export const commentSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },
  username: String,
  text: String,
});

export interface Comment extends CommentDocument {}
export interface CommentModel extends Model<Comment> {}

const Comment: CommentModel = model<Comment, CommentModel>(
  'Comment',
  commentSchema
);

export interface PostDocument extends Document {
  createdAt: Date;
  count: number;
  username: string;
  content: string;
  likesCount: number;
  likes: string[];
  comments: CommentDocument[];
}

export interface Post extends PostDocument {
  writeComment({ username, text }): Comment;
}

export interface PostModel extends Model<Post> {
  write({ count, username, content }): Post;
  list({ cursor, username, self }): Post[];
  like({ _id, username }): Post;
  unlike({ _id, username }): Post;
}

export const postSchema: Schema = new Schema({
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
    type: [commentSchema],
    default: [],
  },
});

postSchema.methods.writeComment = function({ username, text }): Comment {
  this.comments.unshift({ username, text });
  return this.save();
};

postSchema.statics.write = function({ count, username, content }) {
  const post = new this({
    count,
    username,
    content,
  });

  return post.save();
};

postSchema.statics.list = function({ cursor, username, self }): Post[] {
  const query = Object.assign(
    {},
    cursor ? { _id: { $lt: cursor } } : {},
    username ? { username } : {}
  );

  const projection = self
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

postSchema.statics.like = function({ _id, username }): Post {
  return this.findByIdAndUpdate(
    _id,
    {
      $inc: { likesCount: 1 },
      $push: { likes: username },
    },
    { new: true, select: 'likesCount' }
  ).exec();
};

postSchema.statics.unlike = function({ _id, username }): Post {
  return this.findByIdAndUpdate(
    _id,
    {
      $inc: { likesCount: -1 },
      $pull: { likes: username },
    },
    { new: true, select: 'likesCount' }
  ).exec();
};

export const Post: PostModel = model<Post, PostModel>('Post', postSchema);
export default Post;
