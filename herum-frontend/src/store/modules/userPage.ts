import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as UserAPI from 'lib/api/user';

// export type Mock = {
// }
const GET_USER_INFO = 'userPage/GET_USER_INFO';

// export type MockType = {
// };

export const userPageActions = {
  getUserInfo: createAction(GET_USER_INFO, UserAPI.getUserInfo),
};

type GetUserInfoAction = {
  payload: {
    data: {
      profile: {
        thumbnail: string;
        username: string;
      };
      thoughtCount: number;
    };
  };
};

export type UserInfo = {
  profile: {
    thumbnail: string;
    username: string;
  };
  thoughtCount: number;
};

export type UserPageState = {
  userInfo: UserInfo;
};
const initialState: UserPageState = {
  userInfo: {
    profile: {
      thumbnail: '',
      username: '',
    },
    thoughtCount: 0,
  },
};

const reducer = handleActions<UserPageState, any>(
  {
    ...pender({
      type: GET_USER_INFO,
      onSuccess: (state: UserPageState, action: GetUserInfoAction) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          draft.userInfo = action.payload.data;
        });
      },
    }),
  },
  initialState
);

export default reducer;
