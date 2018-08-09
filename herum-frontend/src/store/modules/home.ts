import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import * as PostsAPI from 'lib/api/posts';
import { pender } from 'redux-pender';

export type Comment = {
  createdAt: Date;
  username: string;
  text: string;
};

export type Post = {
  createdAt: Date;
  count: number;
  username: string;
  content: string;
  likesCount: number;
  likes: string[];
  comments: Comment[];
};

const CHANGE_WRITE_POST_INPUT = 'home/CHANGE_WRITE_POST_INPUT';
const WRITE_POST = 'home/WRITE_POST';

// export type MockType = {
// };

type ChangeWritePostInputPayload = { value: string };

export const homeActions = {
  changeWritePostInput: createAction<ChangeWritePostInputPayload, ChangeWritePostInputPayload>(
    CHANGE_WRITE_POST_INPUT,
    (payload: ChangeWritePostInputPayload) => payload
  ),
  writePost: createAction(WRITE_POST, PostsAPI.write),
};

type ChangeWritePostInputAction = ReturnType<typeof homeActions.changeWritePostInput>;
type WritePostAction = {
  payload: {
    data: {
      createdAt: Date;
      count: number;
      username: string;
      content: string;
      likesCount: number;
      likes: string[];
      comments: Comment[];
    };
  };
};

export type HomeState = {
  writePost: {
    value: string;
  };
  post: Post;
};
const initialState: HomeState = {
  writePost: {
    value: '',
  },
  post: {
    createdAt: new Date(),
    count: 0,
    username: '',
    content: '',
    likesCount: 0,
    likes: [],
    comments: [],
  },
};

const reducer = handleActions<HomeState, any>(
  {
    [CHANGE_WRITE_POST_INPUT]: (state: HomeState, action: ChangeWritePostInputAction) => {
      return produce(state, draft => {
        if (!action.payload) {
          return;
        }
        draft.writePost.value = action.payload.value;
      });
    },
    ...pender({
      type: WRITE_POST,
      onSuccess: (state: HomeState, action: WritePostAction) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          draft.writePost.value = '';
          draft.post = action.payload.data;
        });
      },
    }),
  },
  initialState
);

export default reducer;
