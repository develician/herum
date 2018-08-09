require('dotenv').config();

import Koa from 'koa';
import Router from 'koa-router';
import WebSockify from 'koa-websocket';

import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';

import { jwtMiddleware } from 'lib/token';

const { PORT: port = 4000, MONGO_URI: mongoURI } = process.env;
const serve = require('koa-static');
const path = require('path');
const fallback = require('koa-connect-history-api-fallback');

mongoose.Promise = global.Promise;
if (mongoURI !== undefined) {
  mongoose
    .connect(
      mongoURI,
      { useNewUrlParser: true }
    )
    .then(() => {
      console.log('connected to mongo db');
    })
    .catch((e: any) => {
      console.error(e);
    });
}

const app = WebSockify(new Koa());
const router = new Router();
const ws = require('./ws');

app.use(bodyParser());
app.use(jwtMiddleware);

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());
app.ws.use(ws.routes()).use(ws.allowedMethods());

app.use(fallback());

app.use(serve(path.resolve(__dirname, '../../herum-frontend/build/')));

app.listen(port, () => {
  console.log('app is using port', port);
});
