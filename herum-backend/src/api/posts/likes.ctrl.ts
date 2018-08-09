import { Context } from 'koa';
import Post from 'models/post';

const like = async (ctx: Context) => {
  const { user } = (ctx as any).request;
  if (!user) {
    ctx.status = 403;
    return;
  }

  const { postId } = ctx.params;
  const { username } = user.profile;

  try {
    let post = await Post.findById(postId, {
      likesCount: 1,
      likes: {
        $elemMatch: { $eq: username },
      },
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }

    if (post.likes[0] === username) {
      ctx.body = {
        liked: true,
        likesCount: post.likesCount,
      };
      return;
    }

    post = await Post.like({
      _id: postId,
      username,
    });

    ctx.body = {
      liked: true,
      likesCount: post.likesCount,
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

const unlike = async (ctx: Context) => {
  const { user } = (ctx as any).request;
  if (!user) {
    ctx.status = 403;
    return;
  }

  const { postId } = ctx.params;
  const { username } = user.profile;

  try {
    let post = await Post.findById(postId, {
      likesCount: 1,
      likes: {
        $elemMatch: { $eq: username },
      },
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }

    if (post.likes.length === 0) {
      ctx.body = {
        liked: false,
        likesCount: post.likesCount,
      };
      return;
    }

    post = await Post.unlike({
      _id: postId,
      username,
    });

    ctx.body = {
      liked: false,
      likesCount: post.likesCount,
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

export default { like, unlike };
