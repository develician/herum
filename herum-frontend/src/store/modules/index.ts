import { combineReducers } from 'redux';
import base, { BaseState } from './base';
import auth, { AuthState } from './auth';
import user, { UserState } from './user';
import { penderReducer as pender } from 'redux-pender';

export default combineReducers({
  base,
  auth,
  user,
  pender,
});

export type State = {
  base: BaseState;
  auth: AuthState;
  user: UserState;
  pender: {
    pending: any;
    success: any;
    failure: any;
  };
};
