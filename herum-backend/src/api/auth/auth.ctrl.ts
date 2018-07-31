import Joi from "joi";
import Account from "models/account";

const localRegister = async ctx => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6)
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  try {
    let existing = await Account.findByEmailOrUsername(ctx.request.body);
    if (existing) {
      ctx.status = 409;
      ctx.body = {
        key: existing.email === ctx.request.body.email ? "email" : "username"
      };
      return;
    }
  } catch (e) {
    ctx.throw(e, 500);
  }

  try {
    let account: Account = await Account.localRegister(ctx.request.body);

    let token = await account.generateToken();

    ctx.cookies.set("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    ctx.body = account.profile;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

const localLogin = async ctx => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { email, password } = ctx.request.body;

  try {
    let account = await Account.findByEmail(email);

    if (!account || !account.validatePassword(password)) {
      ctx.status = 403;
      return;
    }

    let token = await account.generateToken();

    ctx.cookies.set("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    // console.log(ctx.request.user);
    ctx.body = account.profile;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

const exists = async ctx => {
  const { key, value } = ctx.params;

  try {
    let account = await (key === "email"
      ? Account.findByEmail(value)
      : Account.findByUsername(value));

    ctx.body = {
      exists: account !== null
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

const check = async ctx => {
  const { user } = ctx.request;
  if (!user) {
    ctx.status = 403;
    return;
  }
  ctx.body = user.profile;
};

const logout = async ctx => {
  ctx.cookies.set("access_token", null, {
    maxAge: 0,
    httpOnly: true
  });
  ctx.status = 204;
};

export default { localRegister, localLogin, exists, logout, check };
