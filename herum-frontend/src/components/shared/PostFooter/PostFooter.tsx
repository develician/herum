import * as React from 'react';
import styles from './PostFooter.scss';
import * as classNames from 'classnames/bind';
import { GoHeart } from 'react-icons/go';
import { IoIosChatbubbles } from 'react-icons/io';

const cx = classNames.bind(styles);

interface PostFooterProps {
  likesCount: number;
  comments: any[];
  liked: boolean;
  onToggleLike(): any;
}

const PostFooter: React.SFC<PostFooterProps> = ({ likesCount, comments, liked, onToggleLike }) => (
  <div className={cx('Wrapper')}>
    <div className={cx(liked ? 'LikedLikes' : 'Likes')}>
      <GoHeart onClick={onToggleLike} />
      <span>좋아요 {likesCount}개</span>
    </div>
    <div className={cx('Comments')}>
      <IoIosChatbubbles />
      <span>덧글 {comments.length}개</span>
    </div>
  </div>
);

export default PostFooter;
