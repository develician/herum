import { Context } from 'koa';
import Account from 'models/account';
import Joi from 'joi';
import Post from 'models/post';

const write = async (ctx: Context) => {
  const { user } = (ctx as any).request;

  if (!user) {
    ctx.status = 403;
    ctx.body = {
      message: 'not logged in',
    };

    return;
  }

  try {
    let account = await Account.findById(user._id).exec();
    if (!account) {
      ctx.status = 403;
      return;
    }

    const count = account.thoughtCount + 1;

    const schema = Joi.object().keys({
      content: Joi.string()
        .min(5)
        .max(1000)
        .required(),
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
      ctx.status = 400;
      return;
    }

    const { content } = (ctx as any).request.body;

    let post = await Post.write({
      count,
      username: user.profile.username,
      content,
    });

    await account.increaseThoughtCount();

    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

const list = async (ctx: Context) => {
  try {
    let posts = await Post.list({ cursor: null, username: null, self: null });

    const next =
      posts.length === 20 ? `/api/posts/?cursor=${posts[19]._id}` : null;

    ctx.body = {
      next,
      data: posts,
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

export default { write, list };
