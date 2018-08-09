import * as React from 'react';
import styles from './Post.scss';
import * as classNames from 'classnames/bind';
import TimeAgo from 'react-timeago';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import PostFooter from 'components/shared/PostFooter';

import { Post as PostType } from 'store/modules/posts';

const formatter = buildFormatter(koreanStrings);

const cx = classNames.bind(styles);

interface PostProps {
  post: PostType;
  onToggleLike({ postId, liked }): any;
}

const Post: React.SFC<PostProps> = ({ post, onToggleLike }) => {
  const { count, username, content, createdAt, likesCount, liked } = post;
  const toggleLike = () =>
    onToggleLike({
      postId: post._id,
      liked: post.liked,
    });
  return (
    <div className={cx('Wrapper')}>
      <div className={cx('PostHead')}>
        <div
          className={cx('UserThumbnail')}
          style={{ backgroundImage: `url(/api/users/${username}/thumbnail)` }}
        />
        <div className={cx('Username')}>{username}</div>
        <div className={cx('Count')}>#{count}번째 생각</div>
        <div className={cx('Time')}>
          <TimeAgo date={createdAt} formatter={formatter} />
        </div>
      </div>
      <div className={cx('Content')}>{content}</div>
      <PostFooter
        liked={liked}
        likesCount={likesCount}
        comments={['덧', '글']}
        onToggleLike={toggleLike}
      />
    </div>
  );
};

export default Post;
