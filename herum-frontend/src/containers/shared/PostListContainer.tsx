import * as React from 'react';
import PostList from 'components/shared/PostList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { postsActions, Post } from 'store/modules/posts';
import { State } from 'store/modules';
// import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface PostListContainerProps {
  PostsActions: typeof postsActions;
  next: string;
  data: Post[];
  nextData: Post[];
  logged: boolean;
}

export interface OwnProps {
  username?: string;
}

class PostListContainer extends React.Component<PostListContainerProps & OwnProps> {
  public prev;
  public load = async () => {
    const { PostsActions, username } = this.props;

    try {
      await (PostsActions as any).loadPost(username);

      const { next } = this.props;

      if (next) {
        await PostsActions.prefetchPost(next);
      }
    } catch (e) {
      console.log(e);
    }
  };

  public loadNext = async () => {
    const { PostsActions, next } = this.props;

    PostsActions.showPrefetchedPost();

    if (next === this.prev || !next) return;
    this.prev = next;

    try {
      await PostsActions.prefetchPost(next);
    } catch (e) {
      console.log(e);
    }

    this.handleScroll();
  };

  public handleScroll = () => {
    const { nextData } = this.props;

    if (nextData.length === 0) {
      return;
    }

    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (scrollHeight - innerHeight - scrollTop < 100) {
      this.loadNext();
    }
  };

  public componentDidMount() {
    this.load();
    window.addEventListener('scroll', this.handleScroll);
    this.props.PostsActions.initializeCommentState();
  }
  public componentWillUnmount() {
    // 컴포넌트가 언마운트 될 때에는 스크롤 이벤트리스너를 제거합니다
    window.removeEventListener('scroll', this.handleScroll);
  }

  public componentDidUpdate(prevProps: OwnProps, prevState) {
    if (prevProps.username !== this.props.username) {
      this.load();
      this.props.PostsActions.initializeCommentState();
    }
  }

  public handleToggleLike = ({ postId, liked }): any => {
    const { PostsActions, logged } = this.props;
    const message = toastMessage => <div style={{ fontSize: '1.1rem' }}>{toastMessage}</div>;
    if (!logged) {
      return toast(message('로그인 후 이용 하실 수 있습니다.'), { type: 'error' });
    }
    if (liked) {
      PostsActions.unlikePost(postId);
    } else {
      PostsActions.likePost(postId);
    }
  };

  public handleCommentClick = postId => {
    const { PostsActions } = this.props;

    PostsActions.toggleComment(postId);
    setTimeout(() => (this as any).masonry.masonry.layout(), 0);
  };

  public handleRelayout = () => {
    setTimeout(() => (this as any).masonry.masonry.layout(), 0);
  };

  public render() {
    return (
      <PostList
        posts={this.props.data}
        onToggleLike={this.handleToggleLike}
        onCommentClick={this.handleCommentClick}
        masonryRef={ref => ((this as any).masonry = ref)}
        onRelayout={this.handleRelayout}
      />
    );
  }
}

export default connect(
  ({ posts, user }: State) => ({
    next: posts.next,
    data: posts.data,
    nextData: posts.nextData,
    logged: user.logged,
  }),
  dispatch => ({
    PostsActions: bindActionCreators(postsActions, dispatch),
  })
)(PostListContainer);

// export default compose(
//   withRouter,
//   connect(
//     ({ posts, user }: State) => ({
//       next: posts.next,
//       data: posts.data,
//       nextData: posts.nextData,
//       logged: user.logged,
//     }),
//     dispatch => ({
//       PostsActions: bindActionCreators(postsActions, dispatch),
//     })
//   )
// )(PostListContainer);
