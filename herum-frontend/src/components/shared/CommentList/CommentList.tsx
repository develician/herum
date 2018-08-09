import * as React from 'react';
import styles from './CommentList.scss';
import { Comment as CommentType } from 'store/modules/posts';
import * as classNames from 'classnames/bind';
import Comment from '../Comment/Comment';

const cx = classNames.bind(styles);

interface CommentListProps {
  comments: CommentType[];
  onRelayout?(): void;
}

class CommentList extends React.Component<CommentListProps> {
  public state = {
    limit: 5,
  };

  public handleReadMore = () => {
    this.setState({
      limit: this.state.limit + 10,
    });
    if (this.props.onRelayout) {
      this.props.onRelayout();
    }
  };

  public render() {
    const { comments } = this.props;
    if (comments.length === 0) {
      return null;
    }
    const { limit } = this.state;
    const commentList = comments.slice(0, limit).map(comment => {
      return <Comment key={comment._id} username={comment.username} text={comment.text} />;
    });
    return (
      <div className={cx('CommentListwrapper')}>
        {commentList}
        {limit < comments.length && (
          <div className={cx('ReadMore')} onClick={this.handleReadMore}>
            {comments.length - limit}개 더보기
          </div>
        )}
      </div>
    );
  }
}

export default CommentList;
