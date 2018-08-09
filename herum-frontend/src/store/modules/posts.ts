import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as PostsAPI from 'lib/api/posts';

export type Comment = {
  createdAt: Date;
  username: string;
  text: string;
  _id: string;
};

export type commentsInstance = {
  postId: string;
  visible: boolean;
  value: string;
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
const TOGGLE_COMMENT = 'posts/TOGGLE_COMMENT';
const CHANGE_COMMENT_INPUT = 'posts/CHANGE_COMMENT_INPUT';
const COMMENT = 'posts/COMMENT';
const INITIALIZE_COMMENTS_STATE = 'posts/INITIALIZE_COMMENTS_STATE';

type ChangeCommentInputPayload = { postId: string; value: string };

export const postsActions = {
  loadPost: createAction(LOAD_POST, PostsAPI.list),
  prefetchPost: createAction(PREFETCH_POST, PostsAPI.next),
  showPrefetchedPost: createAction(SHOW_PREFETCHED_POST),
  likePost: createAction(LIKE_POST, PostsAPI.like, payload => payload),
  unlikePost: createAction(UNLIKE_POST, PostsAPI.unlike, payload => payload),
  toggleComment: createAction<string, string>(TOGGLE_COMMENT, payload => payload),
  changeCommentInput: createAction<ChangeCommentInputPayload, ChangeCommentInputPayload>(
    CHANGE_COMMENT_INPUT,
    (payload: ChangeCommentInputPayload) => payload
  ),
  comment: createAction(COMMENT, PostsAPI.comment, ({ postId }) => postId),
  initializeCommentState: createAction(INITIALIZE_COMMENTS_STATE),
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
type ToggleCommentAction = ReturnType<typeof postsActions.toggleComment>;
type ChangeCommentInputAction = ReturnType<typeof postsActions.changeCommentInput>;
type CommentAction = ReturnType<typeof postsActions.comment>;

export type VisibleComment = {
  postId: string;
  visible: boolean;
  value: string;
};

export type PostsState = {
  next: string;
  data: Post[];
  nextData: Post[];
  visibleComments: VisibleComment[];
};
const initialState: PostsState = {
  next: '',
  data: [],
  nextData: [],
  visibleComments: [],
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
    [TOGGLE_COMMENT]: (state: PostsState, action: ToggleCommentAction) => {
      return produce(state, draft => {
        if (!action.payload) {
          return;
        }
        const postId = action.payload;
        // draft.visibleCommentsId = [...draft.visibleCommentsId, postId];
        const existing = state.visibleComments.find((comment, i) => {
          return comment.postId === postId;
        });
        if (!existing) {
          const newVisibleComment = {
            postId,
            visible: true,
            value: '',
          };
          draft.visibleComments = [...draft.visibleComments, newVisibleComment];
        } else {
          const index = state.visibleComments.findIndex(comment => {
            return comment.postId === postId;
          });
          draft.visibleComments[index].visible = !state.visibleComments[index].visible;
        }
      });
    },
    [CHANGE_COMMENT_INPUT]: (state: PostsState, action: ChangeCommentInputAction) => {
      return produce(state, draft => {
        if (!action.payload) {
          return;
        }
        const { postId, value } = action.payload;
        const index = state.visibleComments.findIndex(comment => {
          return comment.postId === postId;
        });
        draft.visibleComments[index].value = value;
      });
    },
    ...pender({
      type: COMMENT,
      onPending: (state: PostsState, action: CommentAction) => {
        return produce(state, draft => {
          const postId = action.meta;
          const index = state.visibleComments.findIndex(comment => {
            return comment.postId === postId;
          });
          draft.visibleComments[index].value = '';
        });
      },
      onSuccess: (state: PostsState, action) => {
        return produce(state, draft => {
          const index = state.data.findIndex(post => {
            return post._id === action.meta;
          });
          draft.data[index].comments = action.payload.data;
        });
      },
    }),
    [INITIALIZE_COMMENTS_STATE]: (state: PostsState, action) => {
      return produce(state, draft => {
        draft.visibleComments = [];
      });
    },
  },
  initialState
);

export default reducer;
