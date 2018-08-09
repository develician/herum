import Router from 'koa-router';
import auth from './auth';
import posts from './posts';
import users from './users';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/posts', posts.routes());
api.use('/users', users.routes());

export default api;
