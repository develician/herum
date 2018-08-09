import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as PostsAPI from 'lib/api/posts';

export type Comment = {
  createdAt: Date;
  username: string;
  text: string;
};

export type Post = {
  _id: string;
  createdAt: Date;
  count: number;
  username: string;
  content: string;
  likesCount: number;
  likes: string[];
  liked: boolean;
  comments: Comment[];
};

const LOAD_POST = 'posts/LOAD_POST';
const PREFETCH_POST = 'posts/PREFETCH_POST';
const SHOW_PREFETCHED_POST = 'posts/SHOW_PREFETCHED_POST';
const RECEIVE_NEW_POST = 'posts/RECEIVE_NEW_POST';
const LIKE_POST = 'posts/LIKE_POST'; // 포스트 좋아요
const UNLIKE_POST = 'posts/UNLIKE_POST'; // 포스트 좋아요 취소

export const postsActions = {
  loadPost: createAction<{}>(LOAD_POST, PostsAPI.list),
  prefetchPost: createAction(PREFETCH_POST, PostsAPI.next),
  showPrefetchedPost: createAction(SHOW_PREFETCHED_POST),
  likePost: createAction(LIKE_POST, PostsAPI.like, payload => payload),
  unlikePost: createAction(UNLIKE_POST, PostsAPI.unlike, payload => payload),
};

type LoadPostAction = {
  payload: {
    data: {
      next: string;
      data: Post[];
    };
  };
};

type PrefetchPostAction = {
  payload: {
    data: {
      next: string;
      data: Post[];
    };
  };
};

type ReceiveNewPostAction = {
  payload: Post;
};

type LikePostPendingAction = ReturnType<typeof postsActions.likePost>;
type UnlikePostPendingAction = ReturnType<typeof postsActions.unlikePost>;

// type LikePostSuccessAction = {
//   payload: {
//     data: {
//       liked: boolean;
//     likesCount: number;
//     }
//   };
// };

export type PostsState = {
  next: string;
  data: Post[];
  nextData: Post[];
};
const initialState: PostsState = {
  next: '',
  data: [],
  nextData: [],
};

const reducer = handleActions<PostsState, any>(
  {
    ...pender({
      type: LOAD_POST,
      onSuccess: (state: PostsState, action: LoadPostAction) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          draft.next = action.payload.data.next;
          draft.data = action.payload.data.data;
        });
      },
    }),
    ...pender({
      type: PREFETCH_POST,
      onSuccess: (state: PostsState, action: PrefetchPostAction) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          draft.next = action.payload.data.next;
          draft.nextData = action.payload.data.data;
        });
      },
    }),
    [SHOW_PREFETCHED_POST]: (state: PostsState) => {
      const nextData = state.nextData;

      return produce(state, draft => {
        draft.data.push(...nextData);
        draft.nextData = [];
      });
    },
    [RECEIVE_NEW_POST]: (state: PostsState, action: ReceiveNewPostAction) => {
      return produce(state, draft => {
        if (!action.payload) {
          return;
        }
        draft.data.unshift(action.payload);
      });
    },
    ...pender({
      type: LIKE_POST,
      onPending: (state: PostsState, action: LikePostPendingAction) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          const index = state.data.findIndex(post => post._id === action.meta);
          draft.data[index].liked = true;
          draft.data[index].likesCount += 1;
        });
      },
      onSuccess: (state: PostsState, action: any) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          const index = state.data.findIndex(post => post._id === action.meta);
          draft.data[index].likesCount = action.payload.data.likesCount;
          draft.data[index].liked = true;
        });
      },
    }),
    ...pender({
      type: UNLIKE_POST,
      onPending: (state: PostsState, action: UnlikePostPendingAction) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          const index = state.data.findIndex(post => post._id === action.meta);
          draft.data[index].liked = false;
          draft.data[index].likesCount -= 1;
        });
      },
      onSuccess: (state: PostsState, action: any) => {
        return produce(state, draft => {
          if (!action.payload) {
            return;
          }
          const index = state.data.findIndex(post => post._id === action.meta);
          draft.data[index].likesCount = action.payload.data.likesCount;
        });
      },
    }),
  },
  initialState
);

export default reducer;
