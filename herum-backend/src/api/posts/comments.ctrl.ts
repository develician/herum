import { Context } from 'koa';
import Joi from 'joi';
import Post from 'models/post';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

const comment = async (ctx: Context) => {
  const { user } = (ctx as any).request;
  if (!user) {
    ctx.status = 403;
    return;
  }

  const schema = Joi.object().keys({
    text: Joi.string()
      .min(1)
      .max(100)
      .required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { username } = user.profile;
  const { text } = (ctx as any).request.body;
  const { postId } = ctx.params;

  if (!ObjectId.isValid(postId)) {
    ctx.status = 400;
    return;
  }

  try {
    let post = await Post.findById(postId).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }

    await post.writeComment({ username, text });

    ctx.body = post.comments;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

export default { comment };
