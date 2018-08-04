import Router from 'koa-router';
import * as postCtrl from './posts.ctrl';

const posts = new Router();

posts.post('/', postCtrl.default.write);
posts.get('/', postCtrl.default.list);

export default posts;
