import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';

export type LoggedInfo = {
  thumbnail: string;
  username: string;
};

const SET_LOGGED_INFO = 'user/SET_LOGGED_INFO';
const SET_VALIDATED = 'user/SET_VALIDATED';
const LOGOUT = 'user/LOGOUT';
const CHECK_STATUS = 'user/CHECK_STATUS';

export const userActions = {
  setLoggedInfo: createAction<LoggedInfo, LoggedInfo>(
    SET_LOGGED_INFO,
    (payload: LoggedInfo) => payload
  ),
  setValidated: createAction<boolean, boolean>(SET_VALIDATED, validated => validated),
  logout: createAction(LOGOUT, AuthAPI.logout),
  checkStatus: createAction(CHECK_STATUS, AuthAPI.checkStatus),
};

type SetLoggedInfoAction = ReturnType<typeof userActions.setLoggedInfo>;
type SetValidatedAction = ReturnType<typeof userActions.setValidated>;
type CheckStatusAction = {
  payload: {
    data: LoggedInfo;
  };
};

export type UserState = {
  loggedInfo: LoggedInfo;
  logged: boolean;
  validated: boolean;
};

const initialState: UserState = {
  loggedInfo: {
    thumbnail: '',
    username: '',
  },
  logged: false,
  validated: false,
};

const reducer = handleActions<UserState, any>(
  {
    [SET_LOGGED_INFO]: (state: UserState, action: SetLoggedInfoAction) => {
      return produce(state, draft => {
        if (action.payload === undefined) {
          return;
        }
        draft.loggedInfo = action.payload;
        draft.logged = true;
      });
    },
    [SET_VALIDATED]: (state: UserState, action: SetValidatedAction) => {
      return produce(state, draft => {
        if (action.payload === undefined) {
          return;
        }
        draft.validated = action.payload;
      });
    },
    ...pender({
      type: CHECK_STATUS,
      onSuccess: (state: UserState, action: CheckStatusAction) => {
        return produce(state, draft => {
          if (action.payload === undefined) {
            return;
          }
          draft.loggedInfo = action.payload.data;
          draft.validated = true;
        });
      },
    }),
  },
  initialState
);

export default reducer;
