import * as React from 'react';
import styles from './Post.scss';
import * as classNames from 'classnames/bind';
import TimeAgo from 'react-timeago';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import PostFooter from '../PostFooter';
import { Link } from 'react-router-dom';
import { Post as PostType } from 'store/modules/posts';
import CommentBlockContainer from 'containers/shared/CommentBlockContainer';

const formatter = buildFormatter(koreanStrings);

const cx = classNames.bind(styles);

interface PostProps {
  post: PostType;
  onToggleLike({ postId, liked }): any;
  onCommentClick(postId: string): void;
  onRelayout?(): void;
}

class Post extends React.Component<PostProps> {
  public shouldComponentUpdate(nextProps: PostProps) {
    return this.props.post !== nextProps.post;
  }
  public render() {
    const {
      count,
      username,
      content,
      createdAt,
      likesCount,
      liked,
      comments,
      _id,
    } = this.props.post;
    const toggleLike = () =>
      this.props.onToggleLike({
        liked,
        postId: _id,
      });
    const commentClick = () => {
      this.props.onCommentClick(_id);
    };
    return (
      <div className={cx('Wrapper')}>
        <div className={cx('PostHead')}>
          <div
            className={cx('UserThumbnail')}
            style={{ backgroundImage: `url(/api/users/${username}/thumbnail)` }}
          />
          <Link to={`/@${username}`} className={cx('Username')}>
            {username}
          </Link>
          <div className={cx('Count')}>#{count}번째 생각</div>
          <div className={cx('Time')}>
            <TimeAgo date={createdAt} formatter={formatter} />
          </div>
        </div>
        <div className={cx('Content')}>{content}</div>
        <PostFooter
          liked={liked}
          likesCount={likesCount}
          comments={comments}
          onToggleLike={toggleLike}
          onCommentClick={commentClick}
        />
        <CommentBlockContainer post={this.props.post} onRelayout={this.props.onRelayout} />
      </div>
    );
  }
}

export default Post;
