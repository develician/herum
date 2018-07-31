import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';

const SET_HEADER_VISIBILITY = 'base/SET_HEADER_VISIBILITY';
const SET_USER_MENU_VISIBILITY = 'base/SET_USER_MENU_VISIBILITY';

export const baseActions = {
  setHeaderVisibility: createAction<boolean, boolean>(SET_HEADER_VISIBILITY, visible => visible),
  setUserMenuVisibility: createAction<boolean, boolean>(
    SET_USER_MENU_VISIBILITY,
    visible => visible
  ),
};

type SetHeaderVisibilityAction = ReturnType<typeof baseActions.setHeaderVisibility>;
type SetUserMenuVisibilityAction = ReturnType<typeof baseActions.setUserMenuVisibility>;

export type BaseState = {
  header: {
    visible: boolean;
  };
  userMenu: {
    visible: boolean;
  };
};

const initialState: BaseState = {
  header: {
    visible: true,
  },
  userMenu: {
    visible: false,
  },
};

const reducer = handleActions<BaseState, any>(
  {
    [SET_HEADER_VISIBILITY]: (state: BaseState, action: SetHeaderVisibilityAction) => {
      return produce(state, draft => {
        if (action.payload === undefined) {
          return;
        }
        draft.header.visible = action.payload;
      });
    },
    [SET_USER_MENU_VISIBILITY]: (state: BaseState, action: SetUserMenuVisibilityAction) => {
      return produce(state, draft => {
        if (action.payload === undefined) {
          return;
        }
        draft.userMenu.visible = action.payload;
      });
    },
  },
  initialState
);

export default reducer;
