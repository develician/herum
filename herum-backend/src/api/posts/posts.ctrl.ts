import { Context } from 'koa';
import Account from 'models/account';
import Joi from 'joi';
import Post from 'models/post';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;
const redis = require('redis');
const publisher = redis.createClient();

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

    post = post.toJSON();
    delete post.likes;
    (post as any).liked = false;

    ctx.body = post;

    publisher.publish(
      'posts',
      JSON.stringify({
        type: 'posts/RECEIVE_NEW_POST',
        payload: post,
      })
    );
  } catch (e) {
    ctx.throw(e, 500);
  }
};

const list = async (ctx: Context) => {
  const { cursor, username } = ctx.query;

  if (cursor && !ObjectId.isValid(cursor)) {
    ctx.status = 400;
    return;
  }

  const { user } = (ctx as any).request;
  const self = user ? user.username : null;

  try {
    let posts = await Post.list({ cursor, username, self });

    const next =
      posts.length === 20
        ? `/api/posts/?${username ? `username=${username}&` : ''}cursor=${
            posts[19]._id
          }`
        : null;

    // 좋아요 했는지 확인
    const checkLiked = post => {
      // posts 에 스키마에 속하지 않은 값을 추가해주려면 toObject() 를 해주어야합니다.
      // 혹은, 쿼리를 하게 될 떄 .lean().exec() 의 형식으로 해야합니다.
      post = post.toObject();
      // 비로그인 상태라면 false
      // 배열에 아이템이 있다면, 자신의 아이디가 들어있다는 뜻이니 true
      const checked = Object.assign(post, {
        liked: user !== null && post.likes.length > 0,
      });
      delete checked.likes; // likes key 제거
      return checked;
    };

    posts = posts.map(checkLiked); // map 을 통하여 각 포스트를 변형시켜줍니다

    ctx.body = {
      next,
      data: posts,
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

export default { write, list };
