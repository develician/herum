import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';

export type Input = {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
};

export type Exists = {
  email: boolean;
  username: boolean;
};

const CHANGE_INPUT = 'auth/CHANGE_INPUT';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';
const CHECK_EMAIL_EXISTS = 'auth/CHECK_EMAIL_EXISTS';
const CHECK_USERNAME_EXISTS = 'auth/CHECK_USERNAME_EXISTS';
const LOCAL_REGISTER = 'auth/LOCAL_REGISTER';
const LOCAL_LOGIN = 'auth/LOCAL_LOGIN';
const SET_ERROR = 'auth/SET_ERROR';

// export type MockType = {
// };

type ChangeInputPayload = { name: string; value: string };
type SetErorPayload = { form: string; message: string };

export const authActions = {
  changeInput: createAction<ChangeInputPayload, ChangeInputPayload>(
    CHANGE_INPUT,
    (payload: ChangeInputPayload) => payload
  ),
  initializeForm: createAction(INITIALIZE_FORM),
  checkEmailExists: createAction(CHECK_EMAIL_EXISTS, AuthAPI.checkEmailExists),
  checkUsernameExists: createAction(CHECK_USERNAME_EXISTS, AuthAPI.checkUsernameExists),
  localRegister: createAction(LOCAL_REGISTER, AuthAPI.localRegister),
  localLogin: createAction(LOCAL_LOGIN, AuthAPI.localLogin),
  setError: createAction<SetErorPayload, SetErorPayload>(
    SET_ERROR,
    (payload: SetErorPayload) => payload
  ),
};

type ChangeInputAction = ReturnType<typeof authActions.changeInput>;
type CheckExistsAction = {
  payload: {
    data: {
      exists: boolean;
    };
  };
};
type SetErrorAction = ReturnType<typeof authActions.setError>;

export type AuthState = {
  input: Input;
  exists: Exists;
  result: any;
  login: {
    error: string;
  };
  register: {
    error: string;
  };
};
const initialState: AuthState = {
  input: {
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  },
  exists: {
    email: false,
    username: false,
  },
  result: null,
  login: {
    error: '',
  },
  register: {
    error: '',
  },
};

const reducer = handleActions<AuthState, any>(
  {
    [CHANGE_INPUT]: (state: AuthState, action: ChangeInputAction) => {
      return produce(state, draft => {
        if (action.payload === undefined) {
          return;
        }
        const { name, value } = action.payload;
        draft.input[name] = value;
      });
    },
    [INITIALIZE_FORM]: (state: AuthState, action: any) => {
      return produce(state, draft => {
        draft.input = initialState.input;
      });
    },
    ...pender({
      type: CHECK_EMAIL_EXISTS,
      onSuccess: (state: AuthState, action: CheckExistsAction) => {
        const { exists } = action.payload.data;
        return produce(state, draft => {
          draft.exists.email = exists;
        });
      },
    }),
    ...pender({
      type: CHECK_USERNAME_EXISTS,
      onSuccess: (state: AuthState, action: CheckExistsAction) => {
        const { exists } = action.payload.data;
        return produce(state, draft => {
          draft.exists.username = exists;
        });
      },
    }),
    ...pender({
      type: LOCAL_REGISTER,
      onSuccess: (state: AuthState, action: any) => {
        return produce(state, draft => {
          draft.result = action.payload.data;
        });
      },
    }),
    ...pender({
      type: LOCAL_LOGIN,
      onSuccess: (state: AuthState, action: any) => {
        return produce(state, draft => {
          draft.result = action.payload.data;
        });
      },
    }),
    [SET_ERROR]: (state: AuthState, action: SetErrorAction) => {
      return produce(state, draft => {
        if (action.payload === undefined) {
          return;
        }
        draft[action.payload.form].error = action.payload.message;
      });
    },
  },
  initialState
);

export default reducer;
