import { Context } from 'koa';
import { Account } from 'models/account';

const getProfile = async (ctx: Context) => {
  const { username } = ctx.params;
  try {
    let account = await Account.findByUsername(username);
    if (!account) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      profile: account.profile,
      thoughtCount: account.thoughtCount,
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

const getThumbnail = async (ctx: Context) => {
  const { username } = ctx.params;

  try {
    let account = await Account.findByUsername(username);
    if (!account) {
      ctx.status = 404;
      return;
    }

    ctx.redirect(account.profile.thumbnail);
  } catch (e) {
    ctx.throw(e, 500);
  }
};

export default { getProfile, getThumbnail };
