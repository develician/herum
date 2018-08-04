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

export interface PostDocument extends Document {
  createdAt: Date;
  count: number;
  username: string;
  content: string;
  likesCount: number;
  likes: string[];
  comments: CommentDocument[];
}

export interface Post extends PostDocument {}

export interface PostModel extends Model<Post> {
  write({ count, username, content }): Post;
  list({ cursor, username, self }): Post[];
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

postSchema.statics.write = function({ count, username, content }) {
  const post = new this({
    count,
    username,
    content,
  });

  return post.save();
};

postSchema.statics.list = function({ cursor, username, self }): Post[] {
  const query = {};

  return this.find(query)
    .sort({ _id: -1 }) // _id 역순
    .limit(20) // 20개로 제한
    .exec();
};

export const Post: PostModel = model<Post, PostModel>('Post', postSchema);
export default Post;
