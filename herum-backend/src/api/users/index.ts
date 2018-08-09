import Router from 'koa-router';
import userCtrl from './user.ctrl';

const users = new Router();

users.get('/:username', userCtrl.getProfile);
users.get('/:username/thumbnail', userCtrl.getThumbnail);

export default users;
