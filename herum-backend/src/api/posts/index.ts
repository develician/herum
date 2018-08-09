import Router from 'koa-router';
import * as postCtrl from './posts.ctrl';
import * as likesCtrl from './likes.ctrl';
import * as commentsCtrl from './comments.ctrl';

const posts = new Router();

posts.post('/', postCtrl.default.write);
posts.get('/', postCtrl.default.list);
posts.post('/:postId/likes', likesCtrl.default.like);
posts.delete('/:postId/likes', likesCtrl.default.unlike);
posts.post('/:postId/comments', commentsCtrl.default.comment);

export default posts;
