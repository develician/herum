import Router from 'koa-router';
import * as postCtrl from './posts.ctrl';
import * as likesCtrl from './likes.ctrl';

const posts = new Router();

posts.post('/', postCtrl.default.write);
posts.get('/', postCtrl.default.list);
posts.post('/:postId/likes', likesCtrl.default.like);
posts.delete('/:postId/likes', likesCtrl.default.unlike);

export default posts;
