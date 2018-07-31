import mongoose, { Schema, Document, Model, model } from "mongoose";
import crypto from "crypto";
import { generateToken } from "lib/token";

export interface AccountDocument extends Document {
  profile: {
    username: string;
    thumbnail: string;
  };
  email: string;
  social: {
    facebook: {
      id: string;
      accessToken: string;
    };
    google: {
      id: string;
      accessToken: string;
    };
  };
  password: string;
  thoughtCount: number;
  createdAt: Date;
}

export interface Account extends AccountDocument {
  hash(password: string): string;
  validatePassword(password: string): boolean;
  generateToken(): string;
}

export interface AccountModel extends Model<Account> {
  localRegister({ username, email, password }): Account;
  findByEmail(email): Account;
  findByUsername(username): Account;
  findByEmailOrUsername({ username, email }): Account;
}

const hash = (password: string): string => {
  if (process.env.SECRET_KEY !== undefined) {
    return crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(password)
      .digest("hex");
  }

  return "";
};

export const accountSchema: Schema = new Schema({
  profile: {
    username: String,
    thumbnail: {
      type: String,
      default: "/static/images/default_thumbnail.png"
    }
  },
  email: { type: String },
  social: {
    facebook: {
      id: String,
      accessToken: String
    },
    google: {
      id: String,
      accessToken: String
    }
  },
  password: String,
  thoughtCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

accountSchema.methods.hash = (password: string): string => {
  if (process.env.SECRET_KEY !== undefined) {
    return crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(password)
      .digest("hex");
  }

  return "";
};
accountSchema.statics.localRegister = function({ username, email, password }) {
  const account = new this({
    profile: {
      username
    },
    email,
    password: hash(password)
  });

  return account.save();
};

accountSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).exec();
};

accountSchema.statics.findByUsername = function(username) {
  return this.findOne({ username }).exec();
};

accountSchema.statics.findByEmailOrUsername = function({ username, email }) {
  return this.findOne({
    $or: [{ "profile.username": username }, { email }]
  }).exec();
};

accountSchema.methods.validatePassword = function(password: string): boolean {
  const hashed = hash(password);
  return this.password === hashed;
};

accountSchema.methods.generateToken = function() {
  const payload = {
    _id: this._id,
    profile: this.profile
  };

  return generateToken(payload, "account");
};

export const Account: AccountModel = model<Account, AccountModel>(
  "Account",
  accountSchema
);
export default Account;
