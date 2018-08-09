import { combineReducers } from 'redux';
import base, { BaseState } from './base';
import auth, { AuthState } from './auth';
import user, { UserState } from './user';
import home, { HomeState } from './home';
import posts, { PostsState } from './posts';
import userPage, { UserPageState } from './userPage';
import { penderReducer as pender } from 'redux-pender';

export default combineReducers({
  base,
  auth,
  user,
  home,
  posts,
  userPage,
  pender,
});

export type State = {
  base: BaseState;
  auth: AuthState;
  user: UserState;
  home: HomeState;
  posts: PostsState;
  userPage: UserPageState;
  pender: {
    pending: any;
    success: any;
    failure: any;
  };
};
