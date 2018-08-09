import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Post, VisibleComment, postsActions } from 'store/modules/posts';
import { State } from 'store/modules';
// import { withRouter } from 'react-router-dom';
import CommentBlock from 'components/shared/CommentBlock';

export interface CommentBlockContainerProps {
  visibleComments: VisibleComment[];
  PostActions: typeof postsActions;
}

export interface OwnProps extends React.Props<any> {
  post: Post;
  onRelayout(): void;
}

class CommentBlockContainer extends React.Component<CommentBlockContainerProps & OwnProps> {
  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { PostActions, post } = this.props;
    PostActions.changeCommentInput({
      value,
      postId: post._id,
    });
  };

  public handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.comment();
    }
  };

  public comment = () => {
    const { PostActions, post, visibleComments } = this.props;
    const targetComment = visibleComments.find(comment => {
      return comment.postId === post._id;
    });
    if (!targetComment) {
      return;
    }
    const value = targetComment.value;
    if (value === '') {
      return;
    }
    PostActions.comment({
      postId: post._id,
      text: value,
    });
  };

  public render() {
    // console.log(this.props.visibleComments);
    const isExisting = this.props.visibleComments.find(comment => {
      return comment.postId === this.props.post._id;
    });

    if (isExisting && isExisting.visible) {
      return (
        <CommentBlock
          visible={true}
          value={isExisting.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          comments={this.props.post.comments}
          onRelayout={this.props.onRelayout}
        />
      );
    }
    return <CommentBlock visible={false} />;
  }
}

export default connect(
  ({ posts }: State, ownProps: any) => ({
    visibleComments: posts.visibleComments,
  }),
  dispatch => ({
    PostActions: bindActionCreators(postsActions, dispatch),
  })
)(CommentBlockContainer);

// export default compose(
//   withRouter,
//   connect(
//     ({ posts }: State, ownProps: any) => ({
//       status: posts.comments[ownProps.post._id],
//     }),
//     dispatch => ({})
//   )
// )(CommentBlockContainer);
